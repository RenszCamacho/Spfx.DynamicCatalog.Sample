import type { IFilterCriteria } from '../models/IFilterCriteria';

const escapeODataValue = (value: string): string =>
  value.replace(/'/g, "''");

const buildCategoryFilter = (categories: string[]): string =>
  `(${categories.map(c => `categoria eq '${escapeODataValue(c)}'`).join(' or ')})`;

const buildStockFilter = (inStock: boolean): string =>
  `inStock eq ${inStock ? '1' : '0'}`;

const joinFilters = (filters: (string | undefined)[]): string | undefined => {
  const valid = filters.filter((f): f is string => f !== undefined);
  return valid.length > 0 ? valid.join(' and ') : undefined;
};

export const buildFilters = (filter?: IFilterCriteria): string | undefined =>
  joinFilters([
    filter?.categories?.length ? buildCategoryFilter(filter.categories) : undefined,
    filter?.inStock !== undefined ? buildStockFilter(filter.inStock) : undefined,
  ]);
