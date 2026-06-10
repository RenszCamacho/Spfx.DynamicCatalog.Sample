import { IProduct } from '../models/IProduct';
import { IFilterCriteria } from '../models/IFilterCriteria';
import { ServiceKey } from '@microsoft/sp-core-library';

export interface ICatalogService {
  getProducts(filter?: IFilterCriteria): Promise<IProduct[]>;
  getCategories(): Promise<string[]>;
  readonly lastError: Error | undefined;
  setListName(listName: string): void;
}

export const CatalogServiceKey: ServiceKey<ICatalogService> =
  ServiceKey.create<ICatalogService>(
    'DinamicCatalog.CatalogService',
    undefined as unknown as { new (...args: any[]): ICatalogService }
  );
