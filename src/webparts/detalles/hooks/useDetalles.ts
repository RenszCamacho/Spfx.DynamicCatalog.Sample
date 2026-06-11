import { useState, useEffect } from 'react';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import type { IProduct } from '../../../models/IProduct';

export function useDetalles(dynamicPropertyValue: DynamicProperty<IProduct> | undefined): { product: IProduct | undefined } {
  const [product, setProduct] = useState<IProduct | undefined>();

  useEffect(() => {
    if (!dynamicPropertyValue) {
      setProduct(undefined);
      return;
    }
    const value = dynamicPropertyValue.tryGetValue();
    setProduct(value);
    const onChange = (): void => {
      const updated = dynamicPropertyValue.tryGetValue();
      setProduct(updated);
    };
    dynamicPropertyValue.register(onChange);
    return () => dynamicPropertyValue.unregister(onChange);
  }, [dynamicPropertyValue]);

  return { product };
}
