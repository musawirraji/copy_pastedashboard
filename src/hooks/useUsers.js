import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/apiUsers';
import toast from 'react-hot-toast';

export function useUsers() {
  const { isPending, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return { isPending, users };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  const { mutate: createNewUser, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user');
    },
  });

  return { createNewUser, isPending };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateExistingUser, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user');
    },
  });

  return { updateExistingUser, isPending };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutate: deleteExistingUser, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user');
    },
  });

  return { deleteExistingUser, isPending };
}
