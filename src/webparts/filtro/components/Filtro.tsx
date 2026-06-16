import * as React from 'react';
import { useEffect } from 'react';
import { Stack, Toggle, Text, Spinner, MessageBar, MessageBarType } from '@fluentui/react';
import { IFiltroProps } from './IFiltroProps';
import { useFiltro } from '../hooks/useFiltro';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import { UI_MESSAGES } from '../../../constants';
import styles from './Filtro.module.scss';

export { IFiltroProps } from './IFiltroProps';

export const Filtro: React.FC<IFiltroProps> = ({ serviceScope, onFilterChanged }) => {
  const {
    categories, selectedCategories, inStock, filterCriteria,
    loading, error, toggleCategory, toggleInStock
  } = useFiltro(serviceScope);

  useEffect(() => {
    onFilterChanged(filterCriteria);
  }, [filterCriteria, onFilterChanged]);

  if (loading) return <Spinner label="Cargando categorías..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Stack tokens={{ childrenGap: 8, padding: 10 }} className={styles.filtro}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>Filtros</Text>

      <Stack tokens={{ childrenGap: 4 }}>
        <Text variant="small">Categoría</Text>
        {categories.length === 0 ? (
          <MessageBar messageBarType={MessageBarType.warning}>{UI_MESSAGES.DISCONNECTED}</MessageBar>
        ) : (
          categories.map(cat => (
            <Toggle
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              inlineLabel
            />
          ))
        )}
      </Stack>

      <Stack tokens={{ childrenGap: 4 }}>
        <Text variant="small">Disponibilidad</Text>
        <Toggle
          label="En stock"
          checked={inStock === true}
          onChange={toggleInStock}
          inlineLabel
        />
      </Stack>
    </Stack>
  );
};
