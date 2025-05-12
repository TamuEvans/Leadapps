import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  username: string | null;
  isVerified: boolean;
};

export function useAuth() {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      // Clear the user from the cache
      queryClient.resetQueries({ queryKey: ['/api/auth/me'] });
      
      // Redirect to login page
      window.location.href = '/login';
    },
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
  };
}