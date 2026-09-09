import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import aget from "../api/agent";
import useAccount from "./useAccount";

type CreateActivity = Omit<Activity, 'id'>;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();

  const {currentUser} = useAccount();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await aget.get<Activity[]>('/activities');
      return response.data;
    },
    enabled: !id && location.pathname == '/activities' && !!currentUser
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['activities', id],
    queryFn: async () => {
      const response = await aget.get<Activity>(`activities/${id}`);
      return response.data
    },
    enabled: !!id && !!currentUser
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      if (!activity.id) {
        throw new Error('Activity id is required');
      }
      await aget.put('/activities', activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities'],
        refetchType: 'active',
      });
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: CreateActivity) => {
      const response = await aget.post<string>('/activities', activity);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities'],
        refetchType: 'active',
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (activityId: string) => {
      await aget.delete(`/activities/${activityId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities'],
        refetchType: 'active',
      });
    },
  });

  return {
    activities,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity
  };
};