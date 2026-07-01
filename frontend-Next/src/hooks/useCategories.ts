import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => api.getCategories(),
    });
};

export const useCategoryById = (params: { categoryId: string }) => {
    return useQuery({
        queryKey: ['category', params.categoryId],
        queryFn: () => api.getCategoryById(params),
    });
};

export const useCategoryProducts = (params: { categoryId: string }) => {
    return useQuery({
        queryKey: ['category-products', params.categoryId],
        queryFn: async () => {
            // Fetch the category metadata and its products in parallel
            const [category, productsData] = await Promise.all([
                api.getCategoryById({ categoryId: params.categoryId }),
                api.getCategoryProducts({ categoryId: params.categoryId }),
            ]);

            return {
                category,
                products: productsData.products ?? [],
                total: productsData.total ?? 0,
                page: productsData.page ?? 1,
                limit: productsData.limit ?? 10,
            };
        },
    });
};

