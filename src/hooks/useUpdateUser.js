import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePassword } from '../services/apiAuth';
import toast from 'react-hot-toast';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Your password has been updated');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Could not update password');
    },
  });

  return { updateUser, isUpdating };
}
