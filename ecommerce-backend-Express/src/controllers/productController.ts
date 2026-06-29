import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../db/client';
import { products } from '../db/schema';

const parseJsonArray = (value: string | null | undefined) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const toProductResponse = (product: any) => ({
  ...product,
  subCategories: parseJsonArray(product.subCategories),
  colors: parseJsonArray(product.colors),
  images: parseJsonArray(product.images),
  comments: [],
});

export const listProducts = async (req: Request, res: Response) => {
  const { category, subcategory, search, minPrice, maxPrice, sort = 'featured', page = '1', limit = '100' } = req.query;
  const rows = await drizzleDb.select().from(products);
  let results = rows.map(toProductResponse);

  if (category) {
    results = results.filter((product) => product.mainCategory.toLowerCase() === String(category).toLowerCase());
  }

  if (subcategory) {
    results = results.filter((product) =>
      product.subCategories.some((sub: string) => sub.toLowerCase() === String(subcategory).toLowerCase()),
    );
  }

  if (search) {
    const query = String(search).toLowerCase();
    results = results.filter((product) => product.name.toLowerCase().includes(query));
  }

  if (minPrice) {
    results = results.filter((product) => product.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter((product) => product.price <= Number(maxPrice));
  }

  switch (sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      results.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      results.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
  }

  const pageNumber = Number(page || '1');
  const pageSize = Number(limit || '12');
  const start = (pageNumber - 1) * pageSize;

  return res.json({
    products: results.slice(start, start + pageSize),
    total: results.length,
    page: pageNumber,
    limit: pageSize,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const [product] = await drizzleDb.select().from(products).where(eq(products.id, Number(req.params.id))).limit(1);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json(toProductResponse(product));
};

export const getProductReviews = async (req: Request, res: Response) => {
  const [product] = await drizzleDb.select().from(products).where(eq(products.id, Number(req.params.id))).limit(1);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json({ productId: product.id, reviews: [] });
};

export const addProductReview = async (req: Request, res: Response) => {
  const [product] = await drizzleDb.select().from(products).where(eq(products.id, Number(req.params.id))).limit(1);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const review = {
    id: Date.now(),
    author: req.body.author || 'Anonymous',
    rating: Number(req.body.rating || 5),
    date: new Date().toISOString(),
    comment: req.body.comment || '',
  };

  await drizzleDb.update(products).set({ reviews: Number(product.reviews) + 1 }).where(eq(products.id, product.id));

  return res.status(201).json(review);
};
