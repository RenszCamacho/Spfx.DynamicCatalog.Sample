import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import { UI_MESSAGES } from '../../constants';

export const Placeholder: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Stack horizontalAlign="center" tokens={{ padding: 20 }}>
      <Text variant="medium">{message || UI_MESSAGES.SELECT_PRODUCT}</Text>
    </Stack>
  );
};
