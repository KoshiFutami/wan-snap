export function resolveBreedName(
  breed: string | null | undefined,
  breedShortName: string | null | undefined,
  options?: { compact?: boolean; fallback?: string },
) {
  if (options?.compact) {
    return breedShortName ?? breed ?? options?.fallback ?? '';
  }

  return breed ?? breedShortName ?? options?.fallback ?? '';
}
