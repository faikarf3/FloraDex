import { useEffect, useState } from 'react';
import { listenToUserProfile, UserProfile } from '@/services/user';

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export function useUserProfile(userId?: string | null): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToUserProfile(
      userId,
      (nextProfile) => {
        setProfile(nextProfile);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(subscriptionError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { profile, loading, error };
}
