export const getPaletteIconPath = (iconName?: string): string | undefined => {
  return iconName
    ? `url(/images/svg/command-palette/${iconName}.svg)`
    : undefined;
};
