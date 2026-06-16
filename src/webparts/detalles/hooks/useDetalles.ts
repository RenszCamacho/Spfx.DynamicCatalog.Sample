import { useState } from 'react';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import type { IProduct } from '../../../models/IProduct';
import { useDynamicPropertySubscription } from '../../../hooks/useDynamicPropertySubscription';

export function useDetalles(
  dynamicPropertyValue: DynamicProperty<IProduct> | undefined
): { product: IProduct | undefined } {
  const [product, setProduct] = useState<IProduct | undefined>();

  useDynamicPropertySubscription(dynamicPropertyValue, setProduct);

  return { product };
}
