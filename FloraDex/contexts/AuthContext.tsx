import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

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

  // Google Auth Session hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'placeholder-ios-client-id',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'placeholder-android-client-id',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'placeholder-web-client-id',
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    const doFirebaseSignIn = async () => {
      if (response?.type === 'success') {
        const idToken = response.authentication?.idToken;
        if (!idToken) {
          throw new Error('No id_token returned from Google');
        }
        const cred = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, cred);
      }
    };
    
    if (response) {
      doFirebaseSignIn().catch(console.error);
    }
  }, [response]);

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
      // Check if environment variables are properly set
      if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 
          process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.includes('placeholder')) {
        throw new Error('Google OAuth client IDs not configured. Please set up Google Cloud Console and add client IDs to .env file.');
      }
      
      // request can be null briefly on first render
      if (!request) {
        throw new Error('Google auth request not ready yet');
      }
      
      const result = await promptAsync(); // opens system browser (not a WebView)
      
      if (result.type === 'cancel') {
        throw new Error('Sign-in cancelled');
      }
      
      // Firebase sign-in happens in the useEffect above
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
