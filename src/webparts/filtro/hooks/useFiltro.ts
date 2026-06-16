import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import { CatalogService } from '../../../services/CatalogService';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';
import { toggleItem, cycleInStock, handleResult } from '../../../utils';
import { buildFilterCriteria } from '../../../helpers';

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

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async (): Promise<void> => {
      setLoading(true);
      setError(undefined);
      const result = await catalogService.getCategories();
      if (cancelled) return;
      handleResult(result, setCategories, setError);
      setLoading(false);
    };

    fetchCategories().catch(() => { /* handled inside */ });
    return () => { cancelled = true; };
  }, [catalogService]);

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

  useEffect(() => {
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
