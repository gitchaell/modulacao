import { db } from '../../data/db/db';
import { articles } from '../../data/db/schema';
import { eq } from 'drizzle-orm';
import type { INewsRepository, NewsEntity } from '../../domain/repositories';

export class TursoNewsRepository implements INewsRepository {
  async findAll(): Promise<NewsEntity[]> {
    return await db.select().from(articles);
  }

  async findById(id: string): Promise<NewsEntity | null> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0] || null;
  }

  async create(article: Omit<NewsEntity, 'createdAt' | 'updatedAt'>): Promise<NewsEntity> {
    const [result] = await db.insert(articles).values({
      ...article,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result;
  }

  async update(id: string, article: Partial<NewsEntity>): Promise<NewsEntity> {
    const [result] = await db.update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }
}
