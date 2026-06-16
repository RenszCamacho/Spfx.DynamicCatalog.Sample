import type { IProduct } from '../models/IProduct';
import type { IFilterCriteria } from '../models/IFilterCriteria';
import { DYNAMIC_PROPERTY_IDS } from '../constants';
import type { IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface ISourceState {
  products: IProduct[];
  selectedProduct: IProduct | undefined;
  filterCriteria: IFilterCriteria;
}

const PROPERTY_RESOLVERS: Record<string, (state: Partial<ISourceState>) => unknown> = {
  [DYNAMIC_PROPERTY_IDS.SELECTED_PRODUCT]: (state) => state.selectedProduct,
  [DYNAMIC_PROPERTY_IDS.FILTER_CRITERIA]: (state) => state.filterCriteria,
};

export const getPropertyDefinitions = (): ReadonlyArray<IDynamicDataPropertyDefinition> => [
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

export const getPropertyValue = (
  propertyId: string,
  state: Partial<ISourceState>
): unknown => {
  const resolver = PROPERTY_RESOLVERS[propertyId];
  return resolver?.(state) ?? undefined;
};
