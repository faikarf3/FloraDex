import { useEffect, useState } from 'react';
import { listenToUserPlants, UserPlant } from '@/services/user';

interface UseUserPlantsResult {
  plants: UserPlant[];
  loading: boolean;
  error: Error | null;
}

export function useUserPlants(userId?: string | null): UseUserPlantsResult {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setPlants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToUserPlants(
      userId,
      (nextPlants) => {
        setPlants(nextPlants);
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

  return { plants, loading, error };
}
