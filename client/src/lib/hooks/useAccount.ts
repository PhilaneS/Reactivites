import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema";
import aget from "../api/agent";
import { useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

export default function useAccount() {

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await aget.post('/login?useCookies=true', creds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });
        }
    });

    const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await aget.get<User>('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user'])
    });

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await aget.post('/account/register', creds)
        },
        onSuccess: () => {
            toast.success('Register successfull - you can now login');
            navigate('/login');
        }
    });

    const logoutUser = useMutation({
        mutationFn: async () => {
            await aget.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user'] });
            queryClient.removeQueries({ queryKey: ['activities'] });
            navigate('/');
        }
    });
    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser
    }
}