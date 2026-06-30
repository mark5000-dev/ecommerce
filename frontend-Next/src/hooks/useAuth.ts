import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: api.getProfile,
        retry: 1,
    })
}

export const useLoginMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (credentials: { email: string, password: string }) => api.login(credentials),
        onSuccess: () => {
            router.push('/');
            router.refresh();
        },
    })
}

export const useRegisterMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (userData: any) => api.register(userData),
        onSuccess: () => {
            router.push('/');
            router.refresh();
        },
    })
}

export const useLogoutMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: api.logout,
        onSuccess: () => {
            router.push('/');
            router.refresh();
        },
    })
}