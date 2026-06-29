const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

let token: string | null = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const setToken = (newToken: string | null) => {
  token = newToken;
  if (typeof window !== 'undefined') {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const getToken = () => token;

// Helper to auto-login if needed during development
async function ensureAuthenticated() {
  if (token) return token;
  
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex@example.com', password: 'password123' })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        return data.token;
      }
    }
  } catch (error) {
    console.error('Auto login failed:', error);
  }
  return null;
}

async function request(path: string, options: RequestInit = {}) {
  const isAuthRequired = path.startsWith('/users/') || path.startsWith('/wishlist') || path.startsWith('/cart');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as Record<string, string>;

  if (isAuthRequired) {
    const currentToken = await ensureAuthenticated();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
  
  register: async (userData: any) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: async () => {
    setToken(null);
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
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.subcategory) query.append('subcategory', params.subcategory);
    if (params.search) query.append('search', params.search);
    if (params.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
    if (params.sort) query.append('sort', params.sort);
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.limit !== undefined) query.append('limit', String(params.limit));

    const queryString = query.toString();
    return request(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: async (id: number | string) => {
    return request(`/products/${id}`);
  },

  getProductReviews: async (id: number | string) => {
    return request(`/products/${id}/reviews`);
  },

  addProductReview: async (id: number | string, review: { author?: string; rating: number; comment: string }) => {
    return request(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  // Categories
  getCategories: async () => {
    return request('/categories');
  },

  getCategoryById: async (id: string) => {
    return request(`/categories/${id}`);
  },

  getCategoryProducts: async (id: string) => {
    return request(`/categories/${id}/products`);
  },

  // User Profile
  getProfile: async () => {
    return request('/users/me');
  },

  updateProfile: async (profileData: any) => {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getAddresses: async () => {
    return request('/users/me/addresses');
  },

  addAddress: async (address: any) => {
    return request('/users/me/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  updateAddress: async (id: number | string, address: any) => {
    return request(`/users/me/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  },

  deleteAddress: async (id: number | string) => {
    return request(`/users/me/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  getPaymentMethods: async () => {
    return request('/users/me/payment-methods');
  },

  addPaymentMethod: async (paymentMethod: any) => {
    return request('/users/me/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethod),
    });
  },

  deletePaymentMethod: async (id: number | string) => {
    return request(`/users/me/payment-methods/${id}`, {
      method: 'DELETE',
    });
  },

  // Wishlist
  getWishlist: async () => {
    return request('/wishlist');
  },

  addWishlistItem: async (productId: number | string) => {
    return request('/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  deleteWishlistItem: async (productId: number | string) => {
    return request(`/wishlist/items/${productId}`, {
      method: 'DELETE',
    });
  },

  // Cart
  getCart: async () => {
    return request('/cart');
  },

  addCartItem: async (productId: number | string, quantity: number, color?: string, size?: string) => {
    return request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, color, size }),
    });
  },

  updateCartItem: async (id: number | string, quantity: number) => {
    return request(`/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  deleteCartItem: async (id: number | string) => {
    return request(`/cart/items/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  getOrders: async () => {
    return request('/orders');
  },
};
