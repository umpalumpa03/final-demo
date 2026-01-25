export function toCamelCase(value: string | null | undefined): string {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return '';

  return trimmedValue.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
