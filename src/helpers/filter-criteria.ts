import type { IFilterCriteria } from '../models/IFilterCriteria';
import type { IProduct } from '../models/IProduct';

export const buildFilterCriteria = (
  selectedCategories: string[],
  inStock: boolean | undefined
): IFilterCriteria => ({
  categories: selectedCategories,
  inStock,
});

export const isSelectedInProducts = (
  products: IProduct[],
  selected: IProduct | undefined
): boolean =>
  selected !== undefined && products.some(p => p.id === selected.id);
