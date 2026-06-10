import * as React from 'react';
import { Stack, Text, Separator } from '@fluentui/react';
import type { IProduct } from '../../../models/IProduct';
import { Placeholder } from '../../../components/shared/Placeholder';
import type { IDetallesProductoProps } from './IDetallesProductoProps';
import styles from './Detalles.module.scss';

export { IDetallesProductoProps };

export const DetallesProducto: React.FC<IDetallesProductoProps> = ({ product }) => {
  if (!product) {
    return <Placeholder />;
  }

  return (
    <Stack className={styles.detalles} tokens={{ padding: 10 }}>
      <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
        {product.nombre}
      </Text>
      <Separator />
      <Stack tokens={{ childrenGap: 8, padding: '10px 0' }}>
        <Text><strong>Categoría:</strong> {product.categoria}</Text>
        <Text><strong>Precio:</strong> ${product.precio.toFixed(2)}</Text>
        <Text><strong>Stock:</strong> {product.inStock ? 'Disponible' : 'Agotado'}</Text>
        <Separator />
        <Text>{product.descripcion}</Text>
      </Stack>
    </Stack>
  );
};
