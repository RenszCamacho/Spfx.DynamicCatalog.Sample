import { useEffect } from 'react';
import type { DynamicProperty } from '@microsoft/sp-component-base';

export const useDynamicPropertySubscription = <T>(
  dynamicPropertyValue: DynamicProperty<T> | undefined,
  onChange: (value: T | undefined) => void
): void => {
  useEffect(() => {
    if (!dynamicPropertyValue) {
      onChange(undefined);
      return;
    }
    onChange(dynamicPropertyValue.tryGetValue());
    const handler = (): void => onChange(dynamicPropertyValue.tryGetValue());
    dynamicPropertyValue.register(handler);
    return () => { dynamicPropertyValue.unregister(handler); };
  }, [dynamicPropertyValue, onChange]);
};
