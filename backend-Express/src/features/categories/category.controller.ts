import type { Request, Response } from 'express';
import { eq, or, sql, desc, asc } from 'drizzle-orm';
import { drizzleDb } from '../../core/db/client';
import { categories } from './category.schema';
import { products } from '../products/product.schema';

const parseJsonArray = (value: any) => {
  if (!value) return [];
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

const toCategoryResponse = (category: any) => ({
  ...category,
  subcategories: parseJsonArray(category.subcategories),
});

const toProductResponse = (product: any) => ({
  ...product,
  subCategories: parseJsonArray(product.subCategories),
  colors: parseJsonArray(product.colors),
  images: parseJsonArray(product.images),
  comments: [],
});

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const rows = await drizzleDb.select().from(categories);
    return res.json(rows.map(toCategoryResponse));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    // Force targetParam to be a single, concrete string to satisfy Drizzle's overload requirements
    const targetParam = String(req.params.id);

    const [category] = await drizzleDb
      .select()
      .from(categories)
      .where(or(eq(categories.categoryId, targetParam), eq(categories.slug, targetParam)))
      .limit(1);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(toCategoryResponse(category));
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const targetParam = String(req.params.id);
    const { page = '1', limit = '10', sort } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const offset = (pageNumber - 1) * pageSize;

    // 1. Fetch matching category using guaranteed string primitives
    const [category] = await drizzleDb
      .select()
      .from(categories)
      .where(or(eq(categories.categoryId, targetParam), eq(categories.slug, targetParam)))
      .limit(1);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // 2. Determine product sort logic
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

    // 3. Query records matching mainCategory
    // Note: Ensuring category.categoryId matches type requirements by forcing primitive evaluations
    const categoryIdStr = String(category.categoryId);

    const [dbProducts, [countResult]] = await Promise.all([
      drizzleDb
        .select()
        .from(products)
        .where(eq(products.mainCategory, categoryIdStr))
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset),
      drizzleDb
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.mainCategory, categoryIdStr))
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