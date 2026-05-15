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

  if (configuredOrigins && configuredOrigins.length > 0) {
    return configuredOrigins.length === 1
      ? configuredOrigins[0]
      : configuredOrigins;
  }

  if (env.NODE_ENV === 'production') {
    return (origin, callback) => {
      if (!origin || origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      callback(null, false);
    };
  }

  return 'http://localhost:3000';
}
