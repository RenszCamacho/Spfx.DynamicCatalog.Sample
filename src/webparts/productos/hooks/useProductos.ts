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

const isSelectedInProducts = (products: IProduct[], selected: IProduct | undefined): boolean =>
  selected !== undefined && products.some(p => p.id === selected.id);

const useDynamicPropertySubscription = (
  dynamicPropertyValue: DynamicProperty<IFilterCriteria> | undefined,
  onChange: (value: IFilterCriteria | undefined) => void
): void => {
  useEffect(() => {
    if (!dynamicPropertyValue) {
      onChange(undefined);
      return;
    }
    onChange(dynamicPropertyValue.tryGetValue());
    const handler = (): void => onChange(dynamicPropertyValue.tryGetValue());
    dynamicPropertyValue.register(handler);
    return () => { dynamicPropertyValue.unregister(handler); };
  }, [dynamicPropertyValue, onChange]);
};

const handleProductsResult = (
  result: { ok: boolean; data?: IProduct[]; error?: Error },
  setProducts: (products: IProduct[]) => void,
  setError: (msg: string) => void
): void => {
  if (result.ok) {
    setProducts(result.data!);
  } else {
    setError(result.error!.message);
  }
};

export function useProductos(
  serviceScope: ServiceScope,
  listName: string,
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
      handleProductsResult(result, setProducts, setError);
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
