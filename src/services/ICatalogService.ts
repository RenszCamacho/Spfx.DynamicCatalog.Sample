import type { IProduct } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';
import type { Result } from '../models/Result';

export interface ICatalogService {
  getProducts(filter?: IFilterCriteria): Promise<Result<IProduct[]>>;
  getCategories(): Promise<Result<string[]>>;
}
