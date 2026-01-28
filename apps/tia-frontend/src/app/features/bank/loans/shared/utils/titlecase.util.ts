export function toTitleCase(str: string | null): string | null {
  if (!str) return null;
  return str
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
