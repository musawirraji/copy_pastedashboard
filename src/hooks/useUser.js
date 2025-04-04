import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../services/apiAuth';

export function useUser() {
  const { isPending, data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    isPending,
    user,
    isAuthenticated: !!user,
    // With the profiles table having issues, rely solely on app_metadata
    isAdmin:
      user?.profile?.role ||
      user?.app_metadata?.role ||
      user?.user_metadata?.role === 'admin',
    isAgency:
      user?.profile?.role ||
      user?.app_metadata?.role ||
      user?.user_metadata?.role === 'agency',
  };
}
