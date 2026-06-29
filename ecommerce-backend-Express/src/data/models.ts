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
  memberSince ?: string;
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
  date ?: string;
  status: string;
  total: number;
  items: CartItemRecord[];
  itemCount: number;
  shippingAddress: string;
  trackingNumber?: string;
  image?: string;
}

export const mockProducts: ProductRecord[] = [
  {
    id: 1,
    name: 'Cashmere Wrap Coat',
    price: 2899,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    mainCategory: 'womens',
    subCategories: ['outerwear', 'coats'],
    description: 'Luxurious cashmere wrap coat with belted waist.',
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 156,
    colors: ['Camel', 'Black', 'Navy'],
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'],
    comments: [{ id: 1, author: 'Sarah M.', rating: 5, date: '2 days ago', comment: 'Exceptional quality and craftsmanship.' }],
    inStock: true,
    stock: 12,
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Silk Evening Gown',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    mainCategory: 'womens',
    subCategories: ['dresses', 'evening'],
    description: 'Floor-length silk charmeuse gown with delicate draping.',
    isNew: true,
    isBestseller: false,
    rating: 5.0,
    reviews: 89,
    colors: ['Champagne', 'Emerald', 'Ruby'],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
    comments: [{ id: 1, author: 'Naomi L.', rating: 5, date: '1 day ago', comment: 'Absolutely stunning.' }],
    inStock: true,
    stock: 8,
    isFeatured: true,
  },
  {
    id: 3,
    name: 'Three-Piece Suit',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    mainCategory: 'mens',
    subCategories: ['suits', 'formalwear'],
    description: 'Impeccably tailored three-piece suit in Super 150s Italian wool.',
    isNew: false,
    isBestseller: true,
    rating: 5.0,
    reviews: 212,
    colors: ['Navy', 'Charcoal', 'Black'],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    comments: [{ id: 1, author: 'Henry D.', rating: 5, date: '2 days ago', comment: 'Tailoring is perfect.' }],
    inStock: true,
    stock: 10,
    isFeatured: true,
  },
  {
    id: 4,
    name: 'Leather Bomber Jacket',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    mainCategory: 'mens',
    subCategories: ['outerwear', 'jackets', 'leather'],
    description: 'Premium lambskin leather bomber jacket with ribbed collar and cuffs.',
    isNew: true,
    isBestseller: false,
    rating: 4.8,
    reviews: 134,
    colors: ['Black', 'Brown'],
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    comments: [{ id: 1, author: 'Aaron T.', rating: 5, date: '2 days ago', comment: 'Soft leather, perfect fit.' }],
    inStock: true,
    stock: 10,
    isFeatured: true,
  },
];