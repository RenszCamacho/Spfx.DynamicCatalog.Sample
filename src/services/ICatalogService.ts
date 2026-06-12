import type { IProduct } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';

export interface ICatalogService {
  getProducts(filter?: IFilterCriteria): Promise<IProduct[]>;
  getCategories(): Promise<string[]>;
  readonly lastError: Error | undefined;
  setListName(listName: string): void;
}
