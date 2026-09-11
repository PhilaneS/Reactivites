import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import aget from "../api/agent";
import { useId, useMemo } from "react";

export const useProfile = (userId?: string) => {
    const queryClient = useQueryClient();
    const profileQuery = useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const response = await aget.get<Profile>(`profiles/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });


    const photosQuery = useQuery({
        queryKey: ['profile', userId, 'photos'],
        queryFn: async () => {
            const response = await aget.get<Photo[]>(`profiles/${userId}/photos`);
            return response.data;
        },
        enabled: !!userId,
    });

    const isCurrentUser = useMemo(() => {
        return userId === queryClient.getQueryData<User>(['user'])?.id;
    }, [userId, queryClient])

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await aget.post('/profiles/add-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }, onSuccess: async (photo: Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', userId]
            });
            queryClient.setQueryData(['user'], (data: User) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', useId], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
        }
    });

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await aget.put(`/profiles/${photo.id}/setMain`);
        },
        onSuccess: async (_, photo) => {
            queryClient.setQueryData<User | undefined>(['user'], (userData) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url
                };
            });
            queryClient.setQueryData<Profile | undefined>(['profile', userId], (profileData) => {
                if (!profileData) return profileData;
                return {
                    ...profileData,
                    imageUrl: photo.url
                };
            });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
                queryClient.invalidateQueries({ queryKey: ['profile', userId, 'photos'] })
            ]);
        }
    });

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await aget.delete(`/profiles/${photoId}/photos`);
        },
        onSuccess: async (_, photoId) => {
            queryClient.setQueryData<Photo[]>(['profile', userId, 'photos'], (photosData) =>
                photosData?.filter(photo => photo.id !== photoId) ?? []
            );
            await queryClient.invalidateQueries({
                queryKey: ['profile', userId, 'photos']
            });
        }
    });

    return {
        profile: profileQuery.data,
        photos: photosQuery.data ?? [],
        isLoadingProfile: profileQuery.isLoading,
        isLoatingPhotos: photosQuery.isLoading,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto
    };
};