import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
} from '../services/apiAgencies';
import toast from 'react-hot-toast';

export function useAgencies() {
  const { isPending, data: agencies } = useQuery({
    queryKey: ['agencies'],
    queryFn: getAgencies,
  });

  return { isPending, agencies };
}

export function useCreateAgency() {
  const queryClient = useQueryClient();

  const { mutate: createNewAgency, isPending } = useMutation({
    mutationFn: createAgency,
    onSuccess: () => {
      toast.success('Agency created successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create agency');
    },
  });

  return { createNewAgency, isPending };
}

export function useUpdateAgency() {
  const queryClient = useQueryClient();

  const { mutate: updateExistingAgency, isPending } = useMutation({
    mutationFn: updateAgency,
    onSuccess: () => {
      toast.success('Agency updated successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update agency');
    },
  });

  return { updateExistingAgency, isPending };
}

export function useDeleteAgency() {
  const queryClient = useQueryClient();

  const { mutate: deleteExistingAgency, isPending } = useMutation({
    mutationFn: deleteAgency,
    onSuccess: () => {
      toast.success('Agency deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete agency');
    },
  });

  return { deleteExistingAgency, isPending };
}
