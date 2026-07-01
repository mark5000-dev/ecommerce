import type { Request, Response } from 'express';
import { eq, and, gte, lte, like, sql, desc, asc } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { products } from './product.schema';

const parseJsonArray = (value: any) => {
  if (!value) return [];
  if (typeof value === 'object') return value; // If Drizzle already parsed it
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
  comments: [], // Kept for frontend compatibility
});

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, sort = 'featured', page = '1', limit = '12' } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const offset = (pageNumber - 1) * pageSize;

    // Build dynamic conditions for Drizzle
    const conditions = [];

    if (category) {
      conditions.push(eq(sql`LOWER(${products.mainCategory})`, String(category).toLowerCase()));
    }

    if (subcategory) {
      // Assuming subCategories is stored as a JSON array or stringified text in DB
      conditions.push(like(sql`LOWER(${products.subCategories})`, `%${String(subcategory).toLowerCase()}%`));
    }

    if (search) {
      conditions.push(like(sql`LOWER(${products.name})`, `%${String(search).toLowerCase()}%`));
    }

    if (minPrice) {
      conditions.push(gte(products.price, Number(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, Number(maxPrice)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine Order By clause
    let orderByClause;
    switch (sort) {
      case 'price-asc':
        orderByClause = asc(products.price);
        break;
      case 'price-desc':
        orderByClause = desc(products.price);
        break;
      case 'newest':
        orderByClause = desc(products.isNew);
        break;
      case 'rating':
        orderByClause = desc(products.rating);
        break;
      case 'featured':
      default:
        orderByClause = desc(products.isBestseller);
    }

    // Execute queries in parallel for efficiency
    const [dbProducts, [countResult]] = await Promise.all([
      drizzleDb
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset),
      drizzleDb
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereClause)
    ]);

    const total = countResult?.count || 0;

    return res.json({
      products: dbProducts.map(toProductResponse),
      total,
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const [product] = await drizzleDb.select().from(products).where(eq(products.id, Number(req.params.id))).limit(1);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(toProductResponse(product));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const [product] = await drizzleDb.select().from(products).where(eq(products.id, Number(req.params.id))).limit(1);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Note: If you add a dedicated reviews table later, select from that table using eq(reviews.productId, product.id)
    // For now, returning an empty array to satisfy frontend's getProductReviews structural expectation
    return res.json([]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const addProductReview = async (req: Request, res: Response) => {
  try {
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

    // Increment the total number of reviews on the product record
    await drizzleDb
      .update(products)
      .set({ reviews: Number(product.reviews || 0) + 1 })
      .where(eq(products.id, product.id));

    return res.status(201).json(review);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};