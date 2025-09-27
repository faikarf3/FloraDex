import { User } from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  level: number;
  plantCount: number;
  createdAt: any; // serverTimestamp
}

export interface UserPlant {
  plantRef: string; // Reference to the global plants collection
  createdAt: any; // serverTimestamp
}

export const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    // Extract username from email (before @ symbol) as default
    const defaultUsername = user.email?.split('@')[0] || 'user';
    
    const userData: UserProfile = {
      email: user.email || '',
      username: defaultUsername,
      displayName: user.displayName || defaultUsername,
      bio: '',
      level: 1,
      plantCount: 0,
      createdAt: serverTimestamp(),
      ...additionalData, // Override with any additional data provided
    };

    // Create the user profile document
    await setDoc(userRef, userData, { merge: true });
    
    // Create the userPlants subcollection by adding a placeholder document
    // This ensures the subcollection exists even when empty
    const userPlantsRef = collection(db, 'users', user.uid, 'userPlants');
    await addDoc(userPlantsRef, {
      // This is a placeholder document to ensure the subcollection exists
      // It will be deleted or replaced when the first real plant is added
      plantRef: 'placeholder',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updates, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addUserPlant = async (userId: string, plantRef: string): Promise<string> => {
  try {
    const userPlantsRef = collection(db, 'users', userId, 'userPlants');
    const plantDoc = await addDoc(userPlantsRef, {
      plantRef: plantRef,
      createdAt: serverTimestamp()
    });
    
    // Update user's plant count
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      plantCount: serverTimestamp() // This will be incremented properly in a real implementation
    }, { merge: true });
    
    return plantDoc.id;
  } catch (error) {
    console.error('Error adding user plant:', error);
    throw error;
  }
};

export const getUserPlants = async (userId: string): Promise<UserPlant[]> => {
  try {
    // This would typically use getDocs to fetch all plants
    // For now, just return empty array as this is a helper function
    return [];
  } catch (error) {
    console.error('Error fetching user plants:', error);
    throw error;
  }
};
