export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  mainCategory: "womens" | "mens" | "kids" | "accessories" | "shoes" | "jewelry";
  subCategories?: string[];
  description?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviews?: number;
  size?: string;
  colors?: string[];
  images?: string[];
  inStock?: boolean;
  stock?: number;
  isFeatured?: boolean;
  comments?: Review[];
}

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  minRating?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface ProductSort {
  field: 'featured' | 'newest' | 'price' | 'rating' | 'name';
  order: 'asc' | 'desc';
}

// Example filter sections
export const filterSections = [
  {
    id: "price",
    title: "Price Range",
    type: "slider" as const,
    min: 0,
    max: 10000,
    step: 100,
    value: [0, 10000],
  },
  {
    id: "category",
    title: "Category",
    type: "checkbox" as const,
    options: [
      { id: "all", label: "All" },
      { id: "outerwear", label: "Outerwear" },
      { id: "accessories", label: "Accessories" },
      { id: "jewelry", label: "Jewelry" },
      { id: "beauty", label: "Beauty" },
    ],
  },
  {
    id: "rating",
    title: "Minimum Rating",
    type: "checkbox" as const,
    options: [
      { id: "5stars", label: "5+ Stars" },
      { id: "4stars", label: "4+ Stars" },
      { id: "3stars", label: "3+ Stars" },
    ],
  },
];


