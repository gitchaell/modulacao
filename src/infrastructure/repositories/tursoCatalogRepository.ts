import { db } from '../../data/db/db';
import { products } from '../../data/db/schema';
import { eq } from 'drizzle-orm';
import type { ICatalogRepository } from '../../domain/repositories';

// Match the actual Drizzle schema for Products
export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  coverImageUrl: string | null;
  variants: string[] | null;
  whatsappNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TursoCatalogRepository implements ICatalogRepository {
  async findAll(): Promise<ProductEntity[]> {
    return await db.select().from(products);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  }

  async create(item: Omit<ProductEntity, 'createdAt' | 'updatedAt'>): Promise<ProductEntity> {
    const [result] = await db.insert(products).values({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result;
  }

  async update(id: string, item: Partial<ProductEntity>): Promise<ProductEntity> {
    const [result] = await db.update(products)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}
