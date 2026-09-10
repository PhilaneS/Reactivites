import { useQuery } from "@tanstack/react-query";
import aget from "../api/agent";

export const useProfile = (userId?: string) => {
    const profileQuery = useQuery({
        queryKey: ['profiles', userId],
        queryFn: async () => {
            const response = await aget.get<Profile>(`profiles/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });

    const photosQuery = useQuery({
        queryKey: ['profiles', userId, 'photos'],
        queryFn: async () => {
            const response = await aget.get<Photo[]>(`profiles/${userId}/photos`);
            return response.data;
        },
        enabled: !!userId,
    });

    return {
        profile: profileQuery.data,
        photos: photosQuery.data ?? [],
        isLoading: profileQuery.isLoading || photosQuery.isLoading,
    };
};