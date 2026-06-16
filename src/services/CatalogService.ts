import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { PageContext } from '@microsoft/sp-page-context';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import { PnPLogging, LogLevel } from '@pnp/logging';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import type { ICatalogService } from './ICatalogService';
import type { IProduct, IProductResponse } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';
import type { Result } from '../models/Result';
import { ok, err, toError } from '../utils';
import { mapToProducts, buildFilters } from '../helpers';
import { SELECT_FIELDS } from '../constants';

export class CatalogService implements ICatalogService {
  public static readonly serviceKey: ServiceKey<ICatalogService> =
    ServiceKey.create<ICatalogService>(
      'DinamicCatalog.CatalogService',
      CatalogService
    );

  private _sp!: SPFI;
  private readonly _listName: string;

  constructor(serviceScope: ServiceScope, listName: string = 'Productos') {
    this._listName = listName;
    serviceScope.whenFinished(() => {
      const pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi()
        .using(SPFx({ pageContext }))
        .using(PnPLogging(LogLevel.Warning));
    });
  }

  public async getProducts(filter?: IFilterCriteria): Promise<Result<IProduct[]>> {
    try {
      const filters = buildFilters(filter);
      const query = this._sp.web.lists.getByTitle(this._listName).items;
      const filtered = filters ? query.filter(filters) : query;
      const items: IProductResponse[] = await filtered.select(SELECT_FIELDS)();
      return ok(mapToProducts(items));
    } catch (e) {
      return err(toError(e).message);
    }
  }

  public async getCategories(): Promise<Result<string[]>> {
    try {
      const field = await this._sp.web.lists
        .getByTitle(this._listName)
        .fields.getByInternalNameOrTitle('categoria')();
      return ok((field as { Choices?: string[] }).Choices ?? []);
    } catch (e) {
      return err(toError(e).message);
    }
  }
}
