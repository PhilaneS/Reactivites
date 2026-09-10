import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import aget from "../api/agent";
import useAccount from "./useAccount";

type CreateActivity = Omit<Activity, 'id'>;

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();

  const { currentUser } = useAccount();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await aget.get<Activity[]>('/activities');
      return response.data;
    },
    enabled: !id && location.pathname == '/activities' && !!currentUser,
    select: data => {
      return data.map(activity => {
        const host = activity.attendees.find(x => x.id === activity.hostId);
        return {
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isGoing: activity.attendees.some(x => x.id === currentUser?.id),
          hostImageUrl: host?.imageUrl
        }
      })
    }
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['activities', id],
    queryFn: async () => {
      const response = await aget.get<Activity>(`activities/${id}`);
      return response.data
    },
    enabled: !!id && !!currentUser,
    select: data => {
      const host = data.attendees.find(x => x.id === data.hostId);
      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees.some(x => x.id === currentUser?.id),
        hostImageUrl: host?.imageUrl
      }
    }
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

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      await await aget.post(`/activities/${id}/attend`);
    },
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ['activities', activityId] });

      const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId]);

      queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => {
        if (!oldActivity || !currentUser)
          return oldActivity

        const isHost = oldActivity.hostId === currentUser.id;
        const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id);

        return {
          ...oldActivity,
          isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
          attendees: isAttending ? isHost ? oldActivity.attendees :
            oldActivity.attendees.filter(x => x.id !== currentUser.id)
            : [...oldActivity.attendees, {
              id: currentUser.id,
              displayName: currentUser.displayName,
              imageUrl: currentUser.imageUrl
            }]
        }

      })
      return { prevActivity };
    },
    onError: (error, activityId, context) => {
      console.log(error);
      if (context?.prevActivity) {
        queryClient.setQueryData(['activities', activityId], context.prevActivity);
      }
    }
  });

  return {
    activities,
    isLoading,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance
  };
};