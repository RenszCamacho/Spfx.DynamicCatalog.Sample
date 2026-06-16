import * as React from 'react';
import { useMemo } from 'react';
import {
  DetailsList, Selection, SelectionMode, IColumn,
  Stack, Text, Spinner,
} from '@fluentui/react';
import type { IProduct } from '../../../models/IProduct';
import { EmptyState } from '../../../components/shared/EmptyState';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import type { IProductosListProps } from './IProductosListProps';
import { useProductos } from '../hooks/useProductos';
import styles from './Productos.module.scss';

const columns: IColumn[] = [
  { key: 'nombre', name: 'Nombre', fieldName: 'nombre', minWidth: 150 },
  { key: 'categoria', name: 'Categoría', fieldName: 'categoria', minWidth: 100 },
  { key: 'precio', name: 'Precio', fieldName: 'precio', minWidth: 80 },
  { key: 'inStock', name: 'Stock', fieldName: 'inStock', minWidth: 60 },
];

const createSelectionHandler = (
  onProductSelected: (product: IProduct | undefined) => void,
  selectProduct: (product: IProduct | undefined) => void
): ((product: IProduct | undefined) => void) =>
  (product: IProduct | undefined): void => {
    selectProduct(product);
    onProductSelected(product);
  };

const buildSelection = (
  onSelect: (product: IProduct | undefined) => void
): Selection => {
  const selection = new Selection({
    onSelectionChanged: () => {
      const selected = selection.getSelection() as IProduct[];
      onSelect(selected.length > 0 ? selected[0] : undefined);
    },
  });
  return selection;
};

export const ProductosList: React.FC<IProductosListProps> = ({
  serviceScope,
  listName,
  dynamicPropertyValue,
  onProductSelected,
}) => {
  const { selectProduct, products, loading, error } = useProductos(serviceScope, listName, dynamicPropertyValue);

  const handleSelect = useMemo(
    () => createSelectionHandler(onProductSelected, selectProduct),
    [onProductSelected, selectProduct]
  );

  const selection = useMemo(() => buildSelection(handleSelect), [handleSelect]);

  if (loading) {
    return <Spinner label="Cargando productos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.single}
          setKey="id"
        />
      )}
    </Stack>
  );
};
