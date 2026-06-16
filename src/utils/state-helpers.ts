import type { Result } from '../models/Result';

export const toggleItem = (items: string[], item: string): string[] =>
  items.includes(item)
    ? items.filter(c => c !== item)
    : [...items, item];

export const cycleInStock = (current: boolean | undefined): boolean | undefined =>
  current === undefined ? true : current ? false : undefined;

export const handleResult = <T>(
  result: Result<T>,
  onSuccess: (data: T) => void,
  onError: (message: string) => void
): void => {
  if (result.ok) {
    onSuccess(result.data);
  } else {
    onError(result.error.message);
  }
};
