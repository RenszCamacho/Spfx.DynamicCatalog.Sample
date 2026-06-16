import { useState, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import { CatalogService } from '../../../services/CatalogService';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';
import { toggleItem, cycleInStock } from '../../../utils';
import { buildFilterCriteria } from '../../../helpers';
import { useFetch } from '../../../hooks/useFetch';

export interface IUseFiltroReturn {
  categories: string[];
  selectedCategories: string[];
  inStock: boolean | undefined;
  filterCriteria: IFilterCriteria;
  loading: boolean;
  error: string | undefined;
  toggleCategory: (category: string) => void;
  toggleInStock: () => void;
}

export function useFiltro(
  serviceScope: ServiceScope,
  onFilterChanged?: (criteria: IFilterCriteria) => void
): IUseFiltroReturn {
  const catalogService = useMemo(
    () => serviceScope.consume(CatalogService.serviceKey),
    [serviceScope]
  );

  const { data: categories, loading, error } = useFetch(
    () => catalogService.getCategories(),
    [],
    [catalogService]
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);

  const toggleCategory = useCallback(
    (category: string) => setSelectedCategories(prev => toggleItem(prev, category)),
    []
  );

  const toggleInStock = useCallback(
    () => setInStock(prev => cycleInStock(prev)),
    []
  );

  const filterCriteria = useMemo(
    () => buildFilterCriteria(selectedCategories, inStock),
    [selectedCategories, inStock]
  );

  // Notify parent of filter changes
  useMemo(() => {
    onFilterChanged?.(filterCriteria);
  }, [filterCriteria, onFilterChanged]);

  return {
    categories,
    selectedCategories,
    inStock,
    filterCriteria,
    loading,
    error,
    toggleCategory,
    toggleInStock,
  };
}
