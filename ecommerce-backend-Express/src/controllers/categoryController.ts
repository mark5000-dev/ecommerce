import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { drizzleDb } from '../db/client';
import { categories, products } from '../db/schema';

const parseJsonArray = (value: string | null | undefined) => {
  if (!value) return [];
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

export const listCategories = async (_req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(categories);
  return res.json(rows.map(toCategoryResponse));
};

export const getCategoryById = async (req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(categories);
  const category = rows.find((item) => item.categoryId === req.params.id || item.slug === req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  return res.json(toCategoryResponse(category));
};

export const getCategoryProducts = async (req: Request, res: Response) => {
  const rows = await drizzleDb.select().from(categories);
  const category = rows.find((item) => item.categoryId === req.params.id || item.slug === req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const items = await drizzleDb.select().from(products).where(eq(products.mainCategory, category.categoryId));
  return res.json({ category: toCategoryResponse(category), products: items });
};
