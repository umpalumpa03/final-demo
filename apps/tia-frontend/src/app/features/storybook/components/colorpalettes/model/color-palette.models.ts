import { colorApplication } from '../config/palette-data.config';

export type ThemeType = keyof typeof colorApplication;

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
