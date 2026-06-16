import { useState, useCallback, useMemo } from 'react';
import type { ServiceScope } from '@microsoft/sp-core-library';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import { CatalogService } from '../../../services/CatalogService';
import type { IProduct } from '../../../models/IProduct';
import type { IFilterCriteria } from '../../../models/IFilterCriteria';
import { useDynamicPropertySubscription } from '../../../hooks/useDynamicPropertySubscription';
import { isSelectedInProducts } from '../../../helpers';
import { useFetch } from '../../../hooks/useFetch';

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

  const [filterCriteria, setFilterCriteria] = useState<IFilterCriteria | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>();

  useDynamicPropertySubscription(dynamicPropertyValue, setFilterCriteria);

  const { data: products, loading, error } = useFetch(
    () => catalogService.getProducts(filterCriteria),
    [],
    [catalogService, filterCriteria]
  );

  // Auto-clear selection when product not in results
  useMemo(() => {
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
