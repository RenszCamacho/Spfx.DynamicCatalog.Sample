import type { IProduct } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';

export interface ICatalogService {
  getProducts(filter?: IFilterCriteria): Promise<IProduct[]>;
  getCategories(): Promise<string[]>;
  readonly lastError: Error | undefined;
  setListName(listName: string): void;
}

export const CatalogServiceKey: ServiceKey<ICatalogService> =
  ServiceKey.create<ICatalogService>(
    'DinamicCatalog.CatalogService',
    undefined as unknown as { new (serviceScope: ServiceScope): ICatalogService }
  );
