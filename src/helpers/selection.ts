import type { IProduct } from '../models/IProduct';
import { Selection } from '@fluentui/react';

export const createSelectionHandler = (
  onProductSelected: (product: IProduct | undefined) => void,
  selectProduct: (product: IProduct | undefined) => void
): ((product: IProduct | undefined) => void) =>
  (product: IProduct | undefined): void => {
    selectProduct(product);
    onProductSelected(product);
  };

export const buildSelection = (
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
