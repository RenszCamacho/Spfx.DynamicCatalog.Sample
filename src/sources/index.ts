import type { IProduct } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';
import { DYNAMIC_PROPERTY_IDS } from '../constants';
import type { IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface ISourceState {
  products: IProduct[];
  selectedProduct: IProduct | undefined;
  filterCriteria: IFilterCriteria;
}

export function getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
  return [
    {
      id: DYNAMIC_PROPERTY_IDS.FILTER_CRITERIA,
      title: 'Filter Criteria',
      description: 'Current filter criteria (categories and stock)',
    },
    {
      id: DYNAMIC_PROPERTY_IDS.SELECTED_PRODUCT,
      title: 'Selected Product',
      description: 'Currently selected product from the list',
    },
  ];
}

export function getPropertyValue(
  propertyId: string,
  state: Partial<ISourceState>
): unknown {
  switch (propertyId) {
    case DYNAMIC_PROPERTY_IDS.SELECTED_PRODUCT:
      return state.selectedProduct;
    case DYNAMIC_PROPERTY_IDS.FILTER_CRITERIA:
      return state.filterCriteria;
    default:
      return undefined;
  }
}
