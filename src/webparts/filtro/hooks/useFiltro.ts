import { useState, useEffect, useCallback, useMemo } from 'react';
import { ServiceScope } from '@microsoft/sp-core-library';
import { CatalogService } from '../../../services/CatalogService';
import { IFilterCriteria } from '../../../models/IFilterCriteria';

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

export function useFiltro(serviceScope: ServiceScope): IUseFiltroReturn {
  const catalogService = useMemo(() => {
    return serviceScope.consume(CatalogService.serviceKey);
  }, [serviceScope]);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const cats = await catalogService.getCategories();
        if (!cancelled) {
          setCategories(cats);
        }
        if (catalogService.lastError && !cancelled) {
          setError(catalogService.lastError.message);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error loading categories');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCategories();
    return () => { cancelled = true; };
  }, [catalogService]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleInStock = useCallback(() => {
    setInStock(prev => prev === undefined ? true : prev ? false : undefined);
  }, []);

  const filterCriteria: IFilterCriteria = useMemo(() => ({
    categories: selectedCategories,
    inStock,
  }), [selectedCategories, inStock]);

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
