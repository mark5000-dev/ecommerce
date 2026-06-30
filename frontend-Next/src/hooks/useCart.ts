import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

//Get cart
export const useCartQuery = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => api.getCart(),
    });
};

//Add to cart
export const useCartMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { productId: string; quantity: number; color?: string; size?: string }) => api.addCartItem(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

//Update cart
export const useCartUpdateMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { id: string, quantity: number }) => api.updateCartItem(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

//Remove from cart
export const useCartRemoveMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { id: string }) => api.deleteCartItem(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

//Clear cart
export const useCartClearMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};