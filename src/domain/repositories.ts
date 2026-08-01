export interface CatalogItem {
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

export interface ICatalogRepository {
  findAll(): Promise<CatalogItem[]>;
  findById(id: string): Promise<CatalogItem | null>;
  create(item: Omit<CatalogItem, 'createdAt' | 'updatedAt'>): Promise<CatalogItem>;
  update(id: string, item: Partial<CatalogItem>): Promise<CatalogItem>;
  delete(id: string): Promise<void>;
}

export interface EventEntity {
  id: string;
  groupId: string | null;
  organizerId: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  mapUrl: string | null;
  coverImageUrl: string | null;
  createdAt: Date;
}

export interface IEventRepository {
  findAll(): Promise<EventEntity[]>;
  findById(id: string): Promise<EventEntity | null>;
  create(event: Omit<EventEntity, 'createdAt'>): Promise<EventEntity>;
  update(id: string, event: Partial<EventEntity>): Promise<EventEntity>;
  delete(id: string): Promise<void>;
}
