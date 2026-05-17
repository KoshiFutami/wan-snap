import { ApiError } from './api';

export function applyOptimisticCountCorrection(
  next: boolean,
  error: unknown,
  setCount: (updater: (count: number) => number) => void,
): boolean {
  if (next && error instanceof ApiError && error.status === 409) {
    setCount((count) => count - 1);
    return true;
  }
  if (!next && error instanceof ApiError && error.status === 404) {
    setCount((count) => count + 1);
    return true;
  }
  return false;
}
