import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sanitizeClientId = (value?: string | null) =>
    value && !value.startsWith('YOUR_') ? value : undefined;

  const rawWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const webClientId = rawWebClientId ?? 'missing-web-client-id';
  const iosClientId = sanitizeClientId(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
  const androidClientId = sanitizeClientId(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID);

  const shouldUseProxy =
    Platform.select({
      ios: !iosClientId,
      android: !androidClientId,
      default: false,
    }) ?? false;

  const [googleRequest, , promptGoogleSignIn] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    webClientId,
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!rawWebClientId) {
        throw new Error('Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your env.');
      }

      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return;
      }

      if (!googleRequest) {
        throw new Error('Google Sign-In is not ready yet. Please try again shortly.');
      }

      if (!shouldUseProxy) {
        if (Platform.OS === 'ios' && !iosClientId) {
          throw new Error('Add EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID to enable Google sign-in on iOS.');
        }
        if (Platform.OS === 'android' && !androidClientId) {
          throw new Error('Add EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID to enable Google sign-in on Android.');
        }
      }

      const result = await promptGoogleSignIn({ useProxy: shouldUseProxy });

      if (result.type !== 'success') {
        if (result.type === 'error') {
          throw new Error(result.error?.message || 'Google sign-in failed.');
        }
        throw new Error('Google sign-in was cancelled.');
      }

      const idToken = result.params?.id_token || result.authentication?.idToken;

      if (!idToken) {
        throw new Error('Unable to retrieve Google identity token.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
