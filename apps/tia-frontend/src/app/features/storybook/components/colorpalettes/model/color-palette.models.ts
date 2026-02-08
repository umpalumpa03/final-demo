export type ThemeType = 'oceanblue' | 'royalblue' | 'deepblue';

export interface ColorPalette {
  id: string;
  title: string;
  subtitle: string;
  theme: ThemeType;
  scssClass: string;
  themeLabel?: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  icon: string;
}
