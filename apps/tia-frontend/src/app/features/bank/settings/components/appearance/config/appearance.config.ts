export interface Theme {
  title: string;
  subtitle: string;
  themeKey: string;
  cssVariable: string;
}

export const themesConfig: Theme[] = [
  {
    title: 'Ocean Blue',
    subtitle: 'Light and refreshing blue theme',
    themeKey: 'oceanBlue',
    cssVariable: '--color-primary',
  },
  {
    title: 'Royal Blue',
    subtitle: 'Classic and elegant blue theme',
    themeKey: 'royalBlue',
    cssVariable: '--color-primary',
  },
  {
    title: 'Deep Blue',
    subtitle: 'Rich and sophisticated blue theme',
    themeKey: 'deepBlue',
    cssVariable: '--color-primary',
  },
] as const;