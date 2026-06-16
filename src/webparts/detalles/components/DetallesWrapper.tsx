import * as React from 'react';
import type { DynamicProperty } from '@microsoft/sp-component-base';
import { DetallesProducto } from './DetallesProducto';
import { useDetalles } from '../hooks/useDetalles';
import type { IProduct } from '../../../models/IProduct';

export const DetallesWrapper: React.FC<{ product: DynamicProperty<IProduct> | undefined }> = ({
  product: dynamicProduct,
}) => {
  const { product } = useDetalles(dynamicProduct);
  return React.createElement(DetallesProducto, { product });
};
