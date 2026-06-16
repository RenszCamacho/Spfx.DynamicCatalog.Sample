import type { IColumn } from '@fluentui/react';

export const PRODUCT_COLUMNS: IColumn[] = [
  { key: 'nombre', name: 'Nombre', fieldName: 'nombre', minWidth: 150 },
  { key: 'categoria', name: 'Categoría', fieldName: 'categoria', minWidth: 100 },
  { key: 'precio', name: 'Precio', fieldName: 'precio', minWidth: 80 },
  { key: 'inStock', name: 'Stock', fieldName: 'inStock', minWidth: 60 },
];
