const INSTAGRAM_USERNAME_REGEX = /^(?!.*\.\.)(?!\.)[a-zA-Z0-9._]+(?<!\.)$/;

/**
 * Instagramユーザーネームのバリデーション
 * 空文字列の場合は null（エラーなし）を返す
 */
export function validateInstagramUsername(value: string): string | null {
  if (value.length === 0) return null;
  if (value.length > 30) return '30文字以内で入力してください';
  if (!INSTAGRAM_USERNAME_REGEX.test(value)) {
    return '英数字・アンダースコア・ピリオドのみ使用できます（先頭・末尾・連続ピリオド不可）';
  }
  return null;
}
