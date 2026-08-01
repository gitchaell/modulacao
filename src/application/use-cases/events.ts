import type { IEventRepository, EventEntity } from '../../domain/repositories';

export class EventUseCases {
  constructor(private readonly eventRepository: IEventRepository) {}

  async getAllEvents(): Promise<EventEntity[]> {
    return await this.eventRepository.findAll();
  }

  async getEventById(id: string): Promise<EventEntity | null> {
    return await this.eventRepository.findById(id);
  }

  async createEvent(event: Omit<EventEntity, 'createdAt'>): Promise<EventEntity> {
    // Add logic to validate dates, check user capacity, etc.
    return await this.eventRepository.create(event);
  }

  async updateEvent(id: string, event: Partial<EventEntity>): Promise<EventEntity> {
    return await this.eventRepository.update(id, event);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
