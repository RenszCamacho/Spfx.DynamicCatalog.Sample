import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import { CatalogService } from '../../../services/CatalogService';
import type { IProduct } from '../../../models/IProduct';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';

export interface IUseProductosReturn {
  products: IProduct[];
  loading: boolean;
  error: string | undefined;
  selectedProduct: IProduct | undefined;
  selectProduct: (product: IProduct | undefined) => void;
  filterCriteria: IFilterCriteria | undefined;
}

export function useProductos(
  serviceScope: ServiceScope,
  dynamicPropertyValue: DynamicProperty<IFilterCriteria> | undefined
): IUseProductosReturn {
  const catalogService = useMemo(() => {
    return serviceScope.consume(CatalogService.serviceKey);
  }, [serviceScope]);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>();
  const [filterCriteria, setFilterCriteria] = useState<IFilterCriteria | undefined>();

  // Subscribe to DynamicProperty changes
  useEffect(() => {
    if (!dynamicPropertyValue) {
      setFilterCriteria(undefined);
      return;
    }
    const value = dynamicPropertyValue.tryGetValue();
    setFilterCriteria(value);
    const onChange = () => {
      const updated = dynamicPropertyValue.tryGetValue();
      setFilterCriteria(updated);
    };
    dynamicPropertyValue.register(onChange);
    return () => {
      dynamicPropertyValue.unregister(onChange);
    };
  }, [dynamicPropertyValue]);

  // Fetch products when filter changes
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const data = await catalogService.getProducts(filterCriteria);
        if (!cancelled) {
          setProducts(data);
          if (catalogService.lastError) {
            setError(catalogService.lastError.message);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [catalogService, filterCriteria]);

  // Auto-clear selection when filter changes and selected product not in results
  useEffect(() => {
    if (selectedProduct && !products.some(p => p.id === selectedProduct.id)) {
      setSelectedProduct(undefined);
    }
  }, [products, selectedProduct]);

  const selectProduct = useCallback((product: IProduct | undefined) => {
    setSelectedProduct(product);
  }, []);

  return {
    products,
    loading,
    error,
    selectedProduct,
    selectProduct,
    filterCriteria,
  };
}
