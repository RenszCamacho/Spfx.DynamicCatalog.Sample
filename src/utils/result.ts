import type { Result } from '../models/Result';

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const err = (message: string): Result<never> => ({
  ok: false,
  error: new Error(message),
});

export const mapResult = <T, U>(result: Result<T>, fn: (data: T) => U): Result<U> =>
  result.ok ? ok(fn(result.data)) : result;

export const flatMapResult = <T, U>(
  result: Result<T>,
  fn: (data: T) => Result<U>
): Result<U> => (result.ok ? fn(result.data) : result);

export const foldResult = <T, U>(
  result: Result<T>,
  onOk: (data: T) => U,
  onErr: (error: Error) => U
): U => (result.ok ? onOk(result.data) : onErr(result.error));

export const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));
