import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup as signupApi } from '../services/apiAuth';
import toast from 'react-hot-toast';

export function useSignup() {
  const queryClient = useQueryClient();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user, variables, context) => {
      // Invalidate users query if it exists
      queryClient.invalidateQueries({ queryKey: ['users'] });

      toast.success(
        "Account successfully created! Please verify the new account from the user's email address."
      );

      // Call the onSuccess callback if provided
      if (context?.onSuccess) {
        context.onSuccess(user);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });

  return {
    signup: (userData, options = {}) => {
      // Pass options as the context parameter
      signup(userData, { onSuccess: options.onSuccess });
    },
    isPending,
  };
}
