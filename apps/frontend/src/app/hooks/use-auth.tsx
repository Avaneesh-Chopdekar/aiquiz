import { useEffect, useState } from 'react';
import { CurrentUserResponse } from '../types/auth';
import { getCurrentUser } from '../api/auth';

export default function useAuth() {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        if (isMounted) setUser(res);
      } catch (error) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
