export const SkeletonVariants = {
  Text: 'text',
  Circle: 'circle',
  Rectangle: 'rectangle'
} as const;

export type SkeletonVariant = typeof SkeletonVariants[keyof typeof SkeletonVariants];
