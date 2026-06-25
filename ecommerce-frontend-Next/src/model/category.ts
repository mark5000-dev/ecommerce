export interface Subcategory {
  id: string;
  name: string;
  slug?: string;
}

export interface Category {
  id: string;
  name: string;            // e.g., "Women"
  slug: string;            // e.g., "women" (used in URLs)
  image: string;           // hero/banner image
  description?: string;    // optional description
  productCount?: number;   // optional, total products in this category
  featured?: boolean;      // optional
  subcategories?: Subcategory[]; // list of subcategories under this main category
}


