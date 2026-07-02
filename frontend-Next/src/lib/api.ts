import { type Order } from "@/model";
import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (newToken: string | null) => {
  if (typeof window !== 'undefined') {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }
};

async function ensureAuthenticated() {
  return getToken();
}

async function request(path: string, options: AxiosRequestConfig = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as Record<string, string>;

  // Dynamically grab the token right before firing the request
  const activeToken = getToken();
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  try {
    const response = await axios({
      url: `${BASE_URL}${path}`,
      ...options,
      headers,
    });
    return response.data;
  } catch (error: any) {
    const errMsg = error.response?.data?.message || error.message || 'Request failed';
    throw new Error(errMsg);
  }
}

export const api = {
  // Auth
  login: async ({ email, password }: { email: string; password: string }) => {
    const data = await request('/auth/login', { method: 'POST', data: { email, password } });
    if (data.token) {
      setToken(data.token); // ◄ Automatically writes token to localStorage
    }
    return data;
  },

  register: async ({ userData }: { userData: any }) => {
    const data = await request('/auth/register', {
      method: 'POST',
      data: userData,
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: async () => {
    setToken(null); // ◄ Instantly deletes the token from localStorage
    return request('/auth/logout', { method: 'POST' });
  },

  // Products
  getProducts: async (params: {
    category?: string;
    subcategory?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    return request('/products', {
      method: 'GET',
      params,
    });
  },

  getProductById: async ({ id }: { id: number | string }) => {
    return request(`/products/${id}`);
  },

  getProductReviews: async ({ id }: { id: number | string }) => {
    return request(`/products/${id}/reviews`);
  },

  addProductReview: async ({ id, review }: { id: number | string; review: { author?: string; rating: number; comment: string } }) => {
    return request(`/products/${id}/reviews`, {
      method: 'POST',
      data: review,
    });
  },

  // Categories
  getCategories: async () => {
    return request('/categories');
  },

  getCategoryById: async ({ categoryId }: { categoryId: string }) => {
    return request(`/categories/${categoryId}`);
  },

  getCategoryProducts: async ({ categoryId, page = 1, limit = 10, sort }: { categoryId: string, page?: number, limit?: number, sort?: string }) => {
    return request(`/categories/${categoryId}/products`, { params: { page, limit, sort } });
  },

  // User Profile
  getProfile: async () => {
    return request('/users/me');
  },

  updateProfile: async ({ profileData }: { profileData: any }) => {
    return request('/users/me', {
      method: 'PUT',
      data: profileData,
    });
  },

  getAddresses: async () => {
    return request('/users/me/addresses');
  },

  addAddress: async ({ address }: { address: any }) => {
    return request('/users/me/addresses', {
      method: 'POST',
      data: address,
    });
  },

  updateAddress: async ({ id, address }: { id: number | string; address: any }) => {
    return request(`/users/me/addresses/${id}`, {
      method: 'PUT',
      data: address,
    });
  },

  deleteAddress: async ({ id }: { id: number | string }) => {
    return request(`/users/me/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  getPaymentMethods: async () => {
    return request('/users/me/payment-methods');
  },

  addPaymentMethod: async ({ paymentMethod }: { paymentMethod: any }) => {
    return request('/users/me/payment-methods', {
      method: 'POST',
      data: paymentMethod,
    });
  },

  deletePaymentMethod: async ({ id }: { id: number | string }) => {
    return request(`/users/me/payment-methods/${id}`, {
      method: 'DELETE',
    });
  },

  // Wishlist
  getWishlist: async () => {
    return request('/wishlist');
  },

  addWishlistItem: async ({ productId }: { productId: number | string }) => {
    return request('/wishlist/items', {
      method: 'POST',
      data: { productId },
    });
  },

  deleteWishlistItem: async ({ productId }: { productId: number | string }) => {
    return request(`/wishlist/items/${productId}`, {
      method: 'DELETE',
    });
  },

  // Cart
  getCart: async () => {
    return request('/cart');
  },

  addCartItem: async ({ productId, quantity, color, size }: { productId: number | string; quantity: number; color?: string; size?: string }) => {
    return request('/cart/items', {
      method: 'POST',
      data: { productId, quantity, color, size },
    });
  },

  updateCartItem: async ({ id, quantity }: { id: number | string; quantity: number }) => {
    return request(`/cart/items/${id}`, {
      method: 'PUT',
      data: { quantity },
    });
  },

  deleteCartItem: async ({ id }: { id: number | string }) => {
    return request(`/cart/items/${id}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return request('/cart/clear', {
      method: 'DELETE',
    });
  },

  // Orders
  getOrders: async (): Promise<{ orders: Order[] }> => {
    return request('/orders', {
      method: 'GET'
  });
}

};