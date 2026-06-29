export interface ReviewRecord {
    id: number;
    author: string;
    rating: number;
    date: string;
    comment: string;
}

export interface ProductRecord {
    id: number;
    name: string;
    price: number;
    image: string;
    mainCategory: string;
    subCategories: string[];
    description: string;
    isNew: boolean;
    isBestseller: boolean;
    rating: number;
    reviews: number;
    colors: string[];
    images: string[];
    comments: ReviewRecord[];
    inStock: boolean;
    stock: number;
    isFeatured: boolean;
}

export interface CategoryRecord {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    productCount: number;
    featured: boolean;
    subcategories: Array<{ id: string; name: string; slug: string }>;
}

export interface UserRecord {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    language: string;
    memberSince?: string;
    loyaltyTier: string;
    loyaltyPoints: number;
}

export interface AddressRecord {
    id: number;
    type: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export interface PaymentMethodRecord {
    id: number;
    type: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
}

export interface CartItemRecord {
    id: number;
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    color: string;
    category: string;
}

export interface WishlistItemRecord {
    id: number;
    productId: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
    addedAt: string;
}

export interface OrderRecord {
    id: string;
    date?: string;
    status: string;
    total: number;
    items: CartItemRecord[];
    itemCount: number;
    shippingAddress: string;
    trackingNumber?: string;
    image?: string;
}