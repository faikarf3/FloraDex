import { User } from 'firebase/auth';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  level: number;
  plantCount: number;
  createdAt: Timestamp | null;
}

export interface UserPlantDocument {
  plantRef?: string;
  createdAt?: Timestamp | null;
}

export interface UserPlant {
  id: string;
  plantRef: string;
  createdAt: Date | null;
}

export const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const existingProfile = await getDoc(userRef);

    if (existingProfile.exists()) {
      return;
    }

    const defaultUsername = user.email?.split('@')[0] || 'user';

    const userData = {
      email: user.email || '',
      username: defaultUsername,
      displayName: user.displayName || defaultUsername,
      bio: '',
      level: 1,
      plantCount: 0,
      createdAt: serverTimestamp(),
      ...additionalData,
    };

    await setDoc(userRef, userData);
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
      plantRef,
      createdAt: serverTimestamp(),
    });

    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        plantCount: increment(1),
      },
      { merge: true }
    );

    return plantDoc.id;
  } catch (error) {
    console.error('Error adding user plant:', error);
    throw error;
  }
};

export const listenToUserPlants = (
  userId: string,
  onUpdate: (plants: UserPlant[]) => void,
  onError?: (error: Error) => void
) => {
  const userPlantsRef = collection(db, 'users', userId, 'userPlants');
  const plantsQuery = query(userPlantsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    plantsQuery,
    (snapshot) => {
      const plants: UserPlant[] = snapshot.docs.reduce<UserPlant[]>((acc, docSnapshot) => {
        const data = docSnapshot.data() as UserPlantDocument;
        const plantRefValue = (data.plantRef || '').trim();

        if (plantRefValue.toLowerCase() === 'placeholder') {
          return acc;
        }

        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;

        acc.push({
          id: docSnapshot.id,
          plantRef: plantRefValue || 'Unknown species',
          createdAt,
        });

        return acc;
      }, []);

      onUpdate(plants);
    },
    (error) => {
      console.error('Error listening to user plants:', error);
      onError?.(error as Error);
    }
  );
};

export const listenToUserProfile = (
  userId: string,
  onUpdate: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
) => {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(null);
        return;
      }

      const data = snapshot.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : null;

      onUpdate({
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        bio: data.bio,
        level: data.level,
        plantCount: data.plantCount ?? 0,
        createdAt,
      });
    },
    (error) => {
      console.error('Error listening to user profile:', error);
      onError?.(error as Error);
    }
  );
};

export const updateUserPlant = async (userId: string, plantId: string, plantRef: string): Promise<void> => {
  try {
    const documentRef = doc(db, 'users', userId, 'userPlants', plantId);
    await setDoc(
      documentRef,
      {
        plantRef,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user plant:', error);
    throw error;
  }
};

export const removeUserPlant = async (userId: string, plantId: string): Promise<void> => {
  try {
    const documentRef = doc(db, 'users', userId, 'userPlants', plantId);
    await deleteDoc(documentRef);

    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        plantCount: increment(-1),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error removing user plant:', error);
    throw error;
  }
};
