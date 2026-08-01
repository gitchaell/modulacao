import { db } from '../../data/db/db';
import { events } from '../../data/db/schema';
import { eq } from 'drizzle-orm';
import type { IEventRepository, EventEntity } from '../../domain/repositories';

export class TursoEventRepository implements IEventRepository {
  async findAll(): Promise<EventEntity[]> {
    return await db.select().from(events);
  }

  async findById(id: string): Promise<EventEntity | null> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0] || null;
  }

  async create(event: Omit<EventEntity, 'createdAt'>): Promise<EventEntity> {
    const [result] = await db.insert(events).values({
      ...event,
      createdAt: new Date(),
    }).returning();
    return result;
  }

  async update(id: string, event: Partial<EventEntity>): Promise<EventEntity> {
    const [result] = await db.update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }
}
