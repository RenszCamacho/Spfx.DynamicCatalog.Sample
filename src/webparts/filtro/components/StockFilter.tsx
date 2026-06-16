import * as React from 'react';
import { Toggle, Text } from '@fluentui/react';

export interface IStockFilterProps {
  inStock: boolean | undefined;
  onToggleInStock: () => void;
}

export const StockFilter: React.FC<IStockFilterProps> = ({
  inStock,
  onToggleInStock,
}) => (
  <>
    <Text variant="small">Disponibilidad</Text>
    <Toggle
      label="En stock"
      checked={inStock === true}
      onChange={onToggleInStock}
      inlineLabel
    />
  </>
);
