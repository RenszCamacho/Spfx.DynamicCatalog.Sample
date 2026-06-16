import * as React from 'react';
import { useMemo } from 'react';
import { DetailsList, SelectionMode, Stack, Text, Spinner } from '@fluentui/react';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import type { IProductosListProps } from './IProductosListProps';
import { useProductos } from '../hooks/useProductos';
import { createSelectionHandler, buildSelection } from '../../../helpers';
import { PRODUCT_COLUMNS } from '../../../constants';
import styles from './Productos.module.scss';

export const ProductosList: React.FC<IProductosListProps> = ({
  serviceScope,
  dynamicPropertyValue,
  onProductSelected,
}) => {
  const { selectProduct, products, loading, error } = useProductos(serviceScope, dynamicPropertyValue);

  const handleSelect = useMemo(
    () => createSelectionHandler(onProductSelected, selectProduct),
    [onProductSelected, selectProduct]
  );

  const selection = useMemo(() => buildSelection(handleSelect), [handleSelect]);

  if (loading) return <Spinner label="Cargando productos..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Stack className={styles.productos} tokens={{ padding: 10 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Productos ({products.length})
      </Text>
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <DetailsList
          items={products}
          columns={PRODUCT_COLUMNS}
          selection={selection}
          selectionMode={SelectionMode.single}
          setKey="id"
        />
      )}
    </Stack>
  );
};
