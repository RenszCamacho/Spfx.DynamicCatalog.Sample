import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import {
  DetailsList, Selection, SelectionMode, IColumn,
  Stack, Text, Spinner,
} from '@fluentui/react';
import type { IProduct } from '../../../models/IProduct';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { IProductosListProps } from './IProductosListProps';
import { useProductos } from '../hooks/useProductos';
import styles from './Productos.module.scss';

const columns: IColumn[] = [
  { key: 'nombre', name: 'Nombre', fieldName: 'nombre', minWidth: 150 },
  { key: 'categoria', name: 'Categoría', fieldName: 'categoria', minWidth: 100 },
  { key: 'precio', name: 'Precio', fieldName: 'precio', minWidth: 80 },
  { key: 'inStock', name: 'Stock', fieldName: 'inStock', minWidth: 60 },
];

export const ProductosList: React.FC<IProductosListProps> = ({
  serviceScope,
  listName,
  dynamicPropertyValue,
  onProductSelected,
}) => {
  const hook = useProductos(serviceScope, listName, dynamicPropertyValue);
  const isFirstRender = useRef(true);

  // Handle user selection — fire both hook state and webpart callback
  const handleSelect = useCallback(
    (product: IProduct | undefined) => {
      hook.selectProduct(product);
      onProductSelected(product);
    },
    [hook.selectProduct, onProductSelected]
  );

  // Sync auto-clear (from filter change) back to webpart
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onProductSelected(hook.selectedProduct);
  }, [hook.selectedProduct, onProductSelected]);

  // Keep handleSelect ref stable for Selection callback
  const handleSelectRef = useRef(handleSelect);
  handleSelectRef.current = handleSelect;

  const selection = useRef<Selection>();
  if (!selection.current) {
    selection.current = new Selection({
      onSelectionChanged: () => {
        const selected = selection.current!.getSelection() as IProduct[];
        handleSelectRef.current(selected.length > 0 ? selected[0] : undefined);
      },
    });
  }

  if (hook.loading) {
    return <Spinner label="Cargando productos..." />;
  }

  if (hook.error) {
    return <ErrorMessage message={hook.error} />;
  }

  return (
    <Stack className={styles.productos} tokens={{ padding: 10 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Productos ({hook.products.length})
      </Text>
      {hook.products.length === 0 ? (
        <EmptyState />
      ) : (
        <DetailsList
          items={hook.products}
          columns={columns}
          selection={selection.current}
          selectionMode={SelectionMode.single}
          setKey="id"
        />
      )}
    </Stack>
  );
};
