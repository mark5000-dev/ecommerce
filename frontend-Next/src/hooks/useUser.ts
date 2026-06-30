import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

//Get user profile
export const useUserProfileQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => api.getProfile()
    });
};

//Update user profile
export const useUserProfileUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profileData: any) => api.updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useAddressesQuery = () => {
    return useQuery({
        queryKey: ['addresses'],
        queryFn: () => api.getAddresses(),
    });
};

export const useAddAddressMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (addressData: any) => api.addAddress(addressData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

export const useUpdateAddressMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, addressData }: { id: string | number, addressData: any }) => api.updateAddress({ id, address: addressData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

export const useDeleteAddressMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => api.deleteAddress({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });
};

export const usePaymentMethodsQuery = () => {
    return useQuery({
        queryKey: ['payment-methods'],
        queryFn: () => api.getPaymentMethods().then(res => res || []),
    });
};


export const useOrdersQuery = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => api.getOrders().then(res => res?.orders || []),
    });
};
