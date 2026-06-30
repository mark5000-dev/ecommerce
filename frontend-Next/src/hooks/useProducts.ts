import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

//Get Products
export const useProductsQuery = (params: any) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => api.getProducts(params),
    });
};

//Get Product By Id
export const useProductByIdQuery = (params: { id: string }) => {
    return useQuery({
        queryKey: ['product', params.id],
        queryFn: () => api.getProductById(params),
    });
};

export const useProductReviewsQuery = (params: { id: string }) => {
    return useQuery({
        queryKey: ['product-reviews', params.id],
        queryFn: () => api.getProductReviews(params),
    });
};


export const useProductReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { id: string, review: { rating: number, comment: string, author?: string } }) => api.addProductReview(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-reviews'] })
        },
    })
}

