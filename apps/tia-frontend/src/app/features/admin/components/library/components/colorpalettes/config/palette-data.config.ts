import { Palette } from '../../../../../../../shared/lib/palettes/model/palette.model';
import { ColorPalette } from '../model/color-palette.models';
import { Note } from '../model/color-palette.models';

export const OCEANBLUE_PALETTE_DATA: Palette[] = [
  { name: 'Primary', code: '#0284c7', modifier: 'primary' },
  { name: 'Secondary', code: '#e0f2fe', modifier: 'secondary' },
  { name: 'Accent', code: '#7dd3fc', modifier: 'accent' },
  { name: 'Muted', code: '#bae6fd', modifier: 'muted' },
  { name: 'Background', code: '#f0f9ff', modifier: 'background' },
  { name: 'Foreground', code: '#0c4a6e', modifier: 'foreground' },
] as const;

export const ROYALBLUE_PALETTE_DATA: Palette[] = [
  { name: 'Primary', code: '#2563EB', modifier: 'primary' },
  { name: 'Secondary', code: '#DBEAFE', modifier: 'secondary' },
  { name: 'Accent', code: '#93C5FD', modifier: 'accent' },
  { name: 'Muted', code: '#BFDBFE', modifier: 'muted' },
  { name: 'Background', code: '#EFF6FF', modifier: 'background' },
  { name: 'Foreground', code: '#1E3A8A', modifier: 'foreground' },
] as const;

export const DEEPBLUE_PALETTE_DATA: Palette[] = [
  { name: 'Primary', code: '#1E40AF', modifier: 'primary' },
  { name: 'Secondary', code: '#E2E8F0', modifier: 'secondary' },
  { name: 'Accent', code: '#94A3B8', modifier: 'accent' },
  { name: 'Muted', code: '#CBD5E1', modifier: 'muted' },
  { name: 'Background', code: '#F8FAFC', modifier: 'background' },
  { name: 'Foreground', code: '#0F172A', modifier: 'foreground' },
] as const;

export const colorPalettes: ColorPalette[] = [
  {
    id: '1',
    title: 'Ocean Blue',
    subtitle: 'Light and refreshing theme perfect for modern applications',
    theme: 'oceanblue',
    scssClass: 'ocean-blue-theme',
    themeLabel: 'Ocean Blue Theme',
  },
  {
    id: '2',
    title: 'Royal Blue',
    subtitle: 'Rich and elegant theme with vibrant blue tones',
    theme: 'royalblue',
    scssClass: 'royal-blue-theme',
    themeLabel: 'Royal Blue Theme',
  },
  {
    id: '3',
    title: 'Deep Blue',
    subtitle: 'Professional and modern theme with sophisticated blues',
    theme: 'deepblue',
    scssClass: 'deep-blue-theme',
    themeLabel: 'Deep Blue Theme',
  },
] as const;

export const palettesData = {
  oceanblue: OCEANBLUE_PALETTE_DATA,
  royalblue: ROYALBLUE_PALETTE_DATA,
  deepblue: DEEPBLUE_PALETTE_DATA,
} as const;

export const OCEANBLUE_APPLICATION_DATA = [
  {
    title: 'Ocean Primary',
    description: 'Clean and refreshing design with excellent readability',
    modifier: 'primary',
  },
  {
    title: 'Ocean Accent',
    description: 'Soft accents for secondary elements',
    modifier: 'secondary',
  },
  {
    title: 'Ocean Muted',
    description: 'Perfect for backgrounds and subtle elements',
    modifier: 'muted',
  },
] as const;

export const ROYALBLUE_APPLICATION_DATA = [
  {
    title: 'Royal Primary',
    description: 'Bold and elegant with strong visual presence',
    modifier: 'primary',
  },
  {
    title: 'Royal Accent',
    description: 'Vibrant accents for emphasis',
    modifier: 'secondary',
  },
  {
    title: 'Royal Muted',
    description: 'Gentle backgrounds for content areas',
    modifier: 'muted',
  },
] as const;

export const DEEPBLUE_APPLICATION_DATA = [
  {
    title: 'Deep Primary',
    description: 'Professional and sophisticated appearance',
    modifier: 'primary',
  },
  {
    title: 'Deep Accent',
    description: 'Neutral accents for modern interfaces',
    modifier: 'secondary',
  },
  {
    title: 'Deep Muted',
    description: 'Subtle backgrounds for corporate design',
    modifier: 'muted',
  },
] as const;

export const colorApplication = {
  oceanblue: OCEANBLUE_APPLICATION_DATA,
  royalblue: ROYALBLUE_APPLICATION_DATA,
  deepblue: DEEPBLUE_APPLICATION_DATA,
} as const;

export const NOTES_DATA: Note[] = [
  {
    id: '1',
    title: 'High Contrast',
    description:
      'All three themes maintain WCAG AA compliant contrast ratios for optimal readability',
    icon: 'high-contrast',
  },
  {
    id: '2',
    title: 'Consistent Hierarchy',
    description:
      'Primary, secondary, and accent colors are carefully balanced for visual hierarchy',
    icon: 'consistent-hierarchy',
  },
  {
    id: '3',
    title: 'Flexible Application',
    description:
      'Each palette works beautifully for dashboards, landing pages, and web applications',
    icon: 'flexible-application',
  },
  {
    id: '4',
    title: 'Easy Switching',
    description:
      'Use the palette selector in the header to instantly switch between themes',
    icon: 'easy-switching',
  },
] as const;
