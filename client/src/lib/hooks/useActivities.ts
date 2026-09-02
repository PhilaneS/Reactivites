import { useQuery } from "@tanstack/react-query";
import aget from "../api/agent";

export const useActivities = () => {
    const {data: activities, isPending} = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await aget.get<Activity[]>('/activities');
      return response.data;
    }
    });
    return { 
        activities, 
        isPending 
    };
}