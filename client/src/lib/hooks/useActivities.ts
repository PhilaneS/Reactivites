import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import aget from "../api/agent";

const activitiesQueryKey = ['activities'] as const;

export const useActivities = () => {
  const queryClient = useQueryClient();

  const activitiesQuery = useQuery({
    queryKey: activitiesQueryKey,
    queryFn: async () => {
      const response = await aget.get<Activity[]>('/activities');
      return response.data;
    },
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
        queryKey: activitiesQueryKey,
        refetchType: 'active',
      });
    },
  });

  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await aget.post('/activities', activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: activitiesQueryKey,
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
        queryKey: activitiesQueryKey,
        refetchType: 'active',
      });
    },
  });

  return {
    activities: activitiesQuery.data,
    isPending: activitiesQuery.isPending,
    updateActivity,
    createActivity,
    deleteActivity,
  };
};