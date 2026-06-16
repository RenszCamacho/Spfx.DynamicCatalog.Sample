import * as React from 'react';
import { Toggle, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { UI_MESSAGES } from '../../../constants';

export interface ICategoryTogglesProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export const CategoryToggles: React.FC<ICategoryTogglesProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
}) => (
  <>
    <Text variant="small">Categoría</Text>
    {categories.length === 0 ? (
      <MessageBar messageBarType={MessageBarType.warning}>{UI_MESSAGES.DISCONNECTED}</MessageBar>
    ) : (
      categories.map(cat => (
        <Toggle
          key={cat}
          label={cat}
          checked={selectedCategories.includes(cat)}
          onChange={() => onToggleCategory(cat)}
          inlineLabel
        />
      ))
    )}
  </>
);
