import { colorApplication } from '../config/palette-data.config';

export type ThemeType = keyof typeof colorApplication;

export interface ColorPalette {
  id: number;
  title: string;
  subtitle: string;
  theme: ThemeType;
  scssClass: string;
  themeLabel?: string;
}
