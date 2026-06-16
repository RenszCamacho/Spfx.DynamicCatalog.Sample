import type { ServiceScope } from '@microsoft/sp-core-library';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';
import type { IProduct } from '../../../models/IProduct';

export interface IProductosListProps {
  serviceScope: ServiceScope;
  dynamicPropertyValue: DynamicProperty<IFilterCriteria> | undefined;
  onProductSelected: (product: IProduct | undefined) => void;
}
