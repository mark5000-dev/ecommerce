import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";


export const useWishlistQuery = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: () => api.getWishlist().then(res => res?.items || []),
    });
};

export const useAddWishlistItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId }: { productId: number | string }) => api.addWishlistItem({ productId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};

export const useDeleteWishlistItemMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId }: { productId: number | string }) => api.deleteWishlistItem({ productId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};