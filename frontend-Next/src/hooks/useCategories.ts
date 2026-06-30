import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    })
}

export const useCategoryById = (params: { categoryId: string }) => {
    return useQuery({
        queryKey: ['category', params.categoryId],
        queryFn: () => api.getCategoryById(params),
    })
}


export const useCategoryProducts = (params: { categoryId: string }) => {
    return useQuery({
        queryKey: ['category-products', params.categoryId],
        queryFn: () => api.getCategoryProducts({ categoryId: params.categoryId }),
    })
}

