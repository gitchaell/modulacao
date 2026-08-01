import type { ICatalogRepository, CatalogItem } from '../../domain/repositories';

export class CatalogUseCases {
  constructor(private readonly catalogRepository: ICatalogRepository) {}

  async getAllProducts(): Promise<CatalogItem[]> {
    return await this.catalogRepository.findAll();
  }

  async getProductById(id: string): Promise<CatalogItem | null> {
    return await this.catalogRepository.findById(id);
  }

  async createProduct(item: Omit<CatalogItem, 'createdAt' | 'updatedAt'>): Promise<CatalogItem> {
    // We could add business rules here (e.g., verifying price format, checking roles)
    return await this.catalogRepository.create(item);
  }

  async updateProduct(id: string, item: Partial<CatalogItem>): Promise<CatalogItem> {
    return await this.catalogRepository.update(id, item);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.catalogRepository.delete(id);
  }
}
