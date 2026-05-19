export function resolveCorsOrigin(
  env: NodeJS.ProcessEnv,
):
  | string
  | string[]
  | ((
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => void) {
  const configuredOrigins = env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  const hasConfiguredOrigins =
    configuredOrigins !== undefined && configuredOrigins.length > 0;

  // 本番環境では Vercel プレビュー URL を常に許可する
  if (env.NODE_ENV === 'production') {
    return (origin, callback) => {
      if (!origin || origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      if (hasConfiguredOrigins && configuredOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    };
  }

  if (hasConfiguredOrigins) {
    return configuredOrigins.length === 1
      ? configuredOrigins[0]
      : configuredOrigins;
  }

  return 'http://localhost:3000';
}
