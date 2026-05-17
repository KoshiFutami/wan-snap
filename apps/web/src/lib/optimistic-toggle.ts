import { ApiError } from './api';

/**
 * 楽観更新後のAPIエラーを補正し、表示件数の破綻を防ぐ。
 * @param next トグル後に想定している状態（true=ON, false=OFF）
 * @returns 補正を適用して呼び出し側で処理を打ち切れる場合は true
 */
export function applyOptimisticCountCorrection(
  next: boolean,
  error: unknown,
  setCount: (updater: (count: number) => number) => void,
): boolean {
  // ONへ切り替えたつもりで409が返るケースは「すでにON」なので、増やした分だけ戻す。
  if (next && error instanceof ApiError && error.status === 409) {
    setCount((count) => count - 1);
    return true;
  }
  // OFFへ切り替えたつもりで404が返るケースは「すでにOFF」なので、減らした分だけ戻す。
  if (!next && error instanceof ApiError && error.status === 404) {
    setCount((count) => count + 1);
    return true;
  }
  return false;
}
