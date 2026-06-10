import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { PageContext } from '@microsoft/sp-page-context';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import { PnPLogging, LogLevel } from '@pnp/logging';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { ICatalogService } from './ICatalogService';
import { IProduct, IProductResponse } from '../models/IProduct';
import { IFilterCriteria } from '../models/IFilterCriteria';

export class CatalogService implements ICatalogService {
  public static readonly serviceKey: ServiceKey<ICatalogService> =
    ServiceKey.create<ICatalogService>(
      'DinamicCatalog.CatalogService',
      CatalogService as unknown as { new (serviceScope: ServiceScope): ICatalogService }
    );

  private _sp!: SPFI;
  private _listName: string;
  private _lastError: Error | undefined;

  constructor(serviceScope: ServiceScope, listName: string = 'Productos') {
    this._listName = listName;
    this._lastError = undefined;
    serviceScope.whenFinished(() => {
      const pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi()
        .using(SPFx({ pageContext }))
        .using(PnPLogging(LogLevel.Warning));
    });
  }

  public get lastError(): Error | undefined {
    return this._lastError;
  }

  public async getProducts(filter?: IFilterCriteria): Promise<IProduct[]> {
    try {
      let query = this._sp.web.lists.getByTitle(this._listName).items;

      const filterParts: string[] = [];
      if (filter?.categories && filter.categories.length > 0) {
        const catFilters = filter.categories.map(c => `categoria eq '${c}'`);
        filterParts.push(`(${catFilters.join(' or ')})`);
      }
      if (filter?.inStock !== undefined) {
        filterParts.push(`inStock eq ${filter.inStock ? '1' : '0'}`);
      }

      if (filterParts.length > 0) {
        query = query.filter(filterParts.join(' and '));
      }

      const items: IProductResponse[] = await query.select(
        'Id,Title,nombre,categoria,precio,inStock,descripcion'
      )();
      this._lastError = undefined;
      return items.map(this._mapToProduct);
    } catch (error) {
      console.error('CatalogService.getProducts error:', error);
      this._lastError = error instanceof Error ? error : new Error(String(error));
      return [];
    }
  }

  public async getCategories(): Promise<string[]> {
    try {
      const field = await this._sp.web.lists
        .getByTitle(this._listName)
        .fields.getByInternalNameOrTitle('categoria')();
      this._lastError = undefined;
      return (field as { Choices?: string[] }).Choices || [];
    } catch (error) {
      console.error('CatalogService.getCategories error:', error);
      this._lastError = error instanceof Error ? error : new Error(String(error));
      return [];
    }
  }

  private _mapToProduct(item: IProductResponse): IProduct {
    return {
      id: item.Id,
      nombre: item.nombre || item.Title || '',
      categoria: item.categoria || '',
      precio: item.precio || 0,
      inStock: !!item.inStock,
      descripcion: item.descripcion || '',
    };
  }
}
