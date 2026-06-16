import * as React from 'react';
import { Stack, Spinner } from '@fluentui/react';
import { IFiltroProps } from './IFiltroProps';
import { useFiltro } from '../hooks/useFiltro';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { CategoryToggles } from './CategoryToggles';
import { StockFilter } from './StockFilter';
import styles from './Filtro.module.scss';

export { IFiltroProps } from './IFiltroProps';

export const Filtro: React.FC<IFiltroProps> = ({ serviceScope, onFilterChanged }) => {
  const {
    categories, selectedCategories, inStock,
    loading, error, toggleCategory, toggleInStock
  } = useFiltro(serviceScope, onFilterChanged);

  if (loading) return <Spinner label="Cargando categorías..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Stack tokens={{ childrenGap: 8, padding: 10 }} className={styles.filtro}>
      <CategoryToggles
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />
      <StockFilter inStock={inStock} onToggleInStock={toggleInStock} />
    </Stack>
  );
};
