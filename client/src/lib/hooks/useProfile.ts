import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import aget from "../api/agent";
import { useMemo, useState } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";
import agent from "../api/agent";

export const useProfile = (userId?: string, predicate?: string) => {
    const [filter, setFilter] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const response = await aget.get<Profile>(`profiles/${userId}`);
            return response.data;
        },
        enabled: !!userId && !predicate
    });


    const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
        queryKey: ['profile', userId, 'photos'],
        queryFn: async () => {
            const response = await aget.get<Photo[]>(`profiles/${userId}/photos`);
            return response.data;
        },
        enabled: !!userId && !predicate,
    });

    const { data: followings, isLoading: loadingFollowings } = useQuery<Profile[]>({
        queryKey: ['followings', userId, predicate],
        queryFn: async () => {
            const response = await agent.get<Profile[]>(`/profiles/${userId}/follow-list?predicate=${predicate}`);
            return response.data
        },
        enabled: !!userId && !!predicate
    })

    const {data: userActivities, isLoading: loadingUserActivities} = useQuery({
        queryKey: ['user-activities', filter],
        queryFn: async () => {
            const response = await agent.get<Activity[]>(`/profiles/${userId}/activities`, {
                params: {
                    filter
                }
            });
            return response.data
        },
        enabled: !!userId && !!filter
    });

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await aget.post('/profiles/add-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }, onSuccess: async (photo: Photo) => {
            queryClient.setQueryData<Photo[]>(['profile', userId, 'photos'], (photosData) => {
                if (!photosData || photosData.some(existingPhoto => existingPhoto.id === photo.id)) {
                    return photosData;
                }

                return [photo, ...photosData];
            });
            await queryClient.invalidateQueries({
                queryKey: ['profile', userId, 'photos']
            });
            queryClient.setQueryData(['user'], (data: User) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', userId], (data: Profile) => {
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

    const updateProfile = useMutation({
        mutationFn: async (profile: EditProfileSchema) => {
            const response = await aget.put<Profile>('/profiles', {
                displayName: profile.displayName,
                bio: profile.bio ?? ''
            });
            return response.data;
        },
        onSuccess: (updatedProfile, profile) => {
            queryClient.setQueryData<Profile | undefined>(['profile', userId], (data) => {
                if (!data) return data;

                return {
                    ...data,
                    displayName: updatedProfile.displayName ?? profile.displayName,
                    bio: updatedProfile.bio ?? profile.bio ?? data.bio
                };
            });

            queryClient.setQueryData<User | undefined>(['user'], (data) => {
                if (!data) return data;

                return {
                    ...data,
                    displayName: updatedProfile.displayName ?? profile.displayName
                };
            });
        }
    });

    const updateFollowing = useMutation({
        mutationFn: async () => {
            await agent.post(`/profiles/${userId}/follow`)
        },
        onSuccess: () => {
            queryClient.setQueryData(['profile', userId], (profile: Profile) => {
                queryClient.invalidateQueries({ queryKey: ['followings', userId, 'followers'] });
                if (!profile || profile.followersCount === undefined) return profile;
                return {
                    ...profile,
                    following: !profile.following,
                    followersCount: profile.following
                        ? profile.followersCount - 1
                        : profile.followersCount + 1
                }
            })
        }

    });

    const isCurrentUser = useMemo(() => {
        return userId === queryClient.getQueryData<User>(['user'])?.id;
    }, [userId, queryClient])

    return {
        profile,
        photos,
        loadingProfile,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto,
        updateProfile,
        updateFollowing,
        followings,
        loadingFollowings,
        userActivities,
        loadingUserActivities,
        setFilter,
        filter
    };
};