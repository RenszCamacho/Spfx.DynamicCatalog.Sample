import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import { CatalogService } from '../../../services/CatalogService';
import type { IProduct } from '../../../models/IProduct';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';
import { useDynamicPropertySubscription } from '../../../hooks/useDynamicPropertySubscription';
import { handleResult } from '../../../utils';
import { isSelectedInProducts } from '../../../helpers';

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
  const catalogService = useMemo(
    () => serviceScope.consume(CatalogService.serviceKey),
    [serviceScope]
  );

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>();
  const [filterCriteria, setFilterCriteria] = useState<IFilterCriteria | undefined>();

  const handleFilterChange = useCallback((value: IFilterCriteria | undefined) => {
    setFilterCriteria(value);
  }, []);

  useDynamicPropertySubscription(dynamicPropertyValue, handleFilterChange);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async (): Promise<void> => {
      setLoading(true);
      setError(undefined);
      const result = await catalogService.getProducts(filterCriteria);
      if (cancelled) return;
      handleResult(result, setProducts, setError);
      setLoading(false);
    };

    fetchProducts().catch(() => { /* handled inside */ });
    return () => { cancelled = true; };
  }, [catalogService, filterCriteria]);

  useEffect(() => {
    if (!isSelectedInProducts(products, selectedProduct)) {
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
