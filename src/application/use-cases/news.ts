import type { INewsRepository, NewsEntity } from '../../domain/repositories';

export class NewsUseCases {
  constructor(private readonly newsRepository: INewsRepository) {}

  async getAllNews(): Promise<NewsEntity[]> {
    return await this.newsRepository.findAll();
  }

  async getNewsById(id: string): Promise<NewsEntity | null> {
    return await this.newsRepository.findById(id);
  }

  async createNews(news: Omit<NewsEntity, 'createdAt' | 'updatedAt'>): Promise<NewsEntity> {
    return await this.newsRepository.create(news);
  }

  async updateNews(id: string, news: Partial<NewsEntity>): Promise<NewsEntity> {
    return await this.newsRepository.update(id, news);
  }

  async deleteNews(id: string): Promise<void> {
    await this.newsRepository.delete(id);
  }
}
