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

export interface NewsEntity {
  id: string;
  authorId: string;
  type: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: string;
  publishedAt: Date | null;
  tags: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface INewsRepository {
  findAll(): Promise<NewsEntity[]>;
  findById(id: string): Promise<NewsEntity | null>;
  create(news: Omit<NewsEntity, 'createdAt' | 'updatedAt'>): Promise<NewsEntity>;
  update(id: string, news: Partial<NewsEntity>): Promise<NewsEntity>;
  delete(id: string): Promise<void>;
}
