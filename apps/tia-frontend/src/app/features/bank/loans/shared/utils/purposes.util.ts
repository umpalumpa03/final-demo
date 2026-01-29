import { toTitleCase } from './titlecase.util';
export function formatPurpose(purpose: string | null): string | null {
  if (!purpose) return null;

  const readable = purpose.replace(/_/g, ' ');
  return toTitleCase(readable);
}
