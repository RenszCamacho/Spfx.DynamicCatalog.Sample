import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import { CatalogService } from '../../../services/CatalogService';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';

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

const buildFilterCriteria = (
  selectedCategories: string[],
  inStock: boolean | undefined
): IFilterCriteria => ({
  categories: selectedCategories,
  inStock,
});

const toggleItem = (items: string[], item: string): string[] =>
  items.includes(item)
    ? items.filter(c => c !== item)
    : [...items, item];

const cycleInStock = (current: boolean | undefined): boolean | undefined =>
  current === undefined ? true : current ? false : undefined;

const handleCategoryResult = (
  result: { ok: boolean; data?: string[]; error?: Error },
  setCategories: (cats: string[]) => void,
  setError: (msg: string) => void
): void => {
  if (result.ok) {
    setCategories(result.data!);
  } else {
    setError(result.error!.message);
  }
};

export function useFiltro(serviceScope: ServiceScope): IUseFiltroReturn {
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
      handleCategoryResult(result, setCategories, setError);
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
