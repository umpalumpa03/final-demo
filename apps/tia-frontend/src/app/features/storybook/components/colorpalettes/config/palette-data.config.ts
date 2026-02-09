import { TranslateService } from '@ngx-translate/core';
import { Palette } from '../../../../../shared/lib/palettes/model/palette.model';
import { ColorPalette } from '../model/color-palette.models';
import { Note } from '../model/color-palette.models';

export const getOceanBluePaletteData = (
  translate: TranslateService,
): Palette[] => [
  {
    name: translate.instant('storybook.palette.colorNames.primary'),
    code: '#0284c7',
    modifier: 'primary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.secondary'),
    code: '#e0f2fe',
    modifier: 'secondary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.accent'),
    code: '#7dd3fc',
    modifier: 'accent',
  },
  {
    name: translate.instant('storybook.palette.colorNames.muted'),
    code: '#bae6fd',
    modifier: 'muted',
  },
  {
    name: translate.instant('storybook.palette.colorNames.background'),
    code: '#f0f9ff',
    modifier: 'background',
  },
  {
    name: translate.instant('storybook.palette.colorNames.foreground'),
    code: '#0c4a6e',
    modifier: 'foreground',
  },
];

export const getRoyalBluePaletteData = (
  translate: TranslateService,
): Palette[] => [
  {
    name: translate.instant('storybook.palette.colorNames.primary'),
    code: '#2563EB',
    modifier: 'primary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.secondary'),
    code: '#DBEAFE',
    modifier: 'secondary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.accent'),
    code: '#93C5FD',
    modifier: 'accent',
  },
  {
    name: translate.instant('storybook.palette.colorNames.muted'),
    code: '#BFDBFE',
    modifier: 'muted',
  },
  {
    name: translate.instant('storybook.palette.colorNames.background'),
    code: '#EFF6FF',
    modifier: 'background',
  },
  {
    name: translate.instant('storybook.palette.colorNames.foreground'),
    code: '#1E3A8A',
    modifier: 'foreground',
  },
];

export const getDeepBluePaletteData = (
  translate: TranslateService,
): Palette[] => [
  {
    name: translate.instant('storybook.palette.colorNames.primary'),
    code: '#1E40AF',
    modifier: 'primary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.secondary'),
    code: '#E2E8F0',
    modifier: 'secondary',
  },
  {
    name: translate.instant('storybook.palette.colorNames.accent'),
    code: '#94A3B8',
    modifier: 'accent',
  },
  {
    name: translate.instant('storybook.palette.colorNames.muted'),
    code: '#CBD5E1',
    modifier: 'muted',
  },
  {
    name: translate.instant('storybook.palette.colorNames.background'),
    code: '#F8FAFC',
    modifier: 'background',
  },
  {
    name: translate.instant('storybook.palette.colorNames.foreground'),
    code: '#0F172A',
    modifier: 'foreground',
  },
];

export const getColorPalettes = (
  translate: TranslateService,
): ColorPalette[] => [
  {
    id: '1',
    title: translate.instant('storybook.palette.themes.oceanBlue.title'),
    subtitle: translate.instant('storybook.palette.themes.oceanBlue.subtitle'),
    theme: 'oceanblue',
    scssClass: 'ocean-blue-theme',
    themeLabel: translate.instant('storybook.palette.themes.oceanBlue.label'),
  },
  {
    id: '2',
    title: translate.instant('storybook.palette.themes.royalBlue.title'),
    subtitle: translate.instant('storybook.palette.themes.royalBlue.subtitle'),
    theme: 'royalblue',
    scssClass: 'royal-blue-theme',
    themeLabel: translate.instant('storybook.palette.themes.royalBlue.label'),
  },
  {
    id: '3',
    title: translate.instant('storybook.palette.themes.deepBlue.title'),
    subtitle: translate.instant('storybook.palette.themes.deepBlue.subtitle'),
    theme: 'deepblue',
    scssClass: 'deep-blue-theme',
    themeLabel: translate.instant('storybook.palette.themes.deepBlue.label'),
  },
];

export const getPalettesData = (translate: TranslateService) => ({
  oceanblue: getOceanBluePaletteData(translate),
  royalblue: getRoyalBluePaletteData(translate),
  deepblue: getDeepBluePaletteData(translate),
});

export const getOceanBlueApplicationData = (translate: TranslateService) => [
  {
    title: translate.instant(
      'storybook.palette.application.oceanBlue.primary.title',
    ),
    description: translate.instant(
      'storybook.palette.application.oceanBlue.primary.description',
    ),
    modifier: 'primary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.oceanBlue.accent.title',
    ),
    description: translate.instant(
      'storybook.palette.application.oceanBlue.accent.description',
    ),
    modifier: 'secondary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.oceanBlue.muted.title',
    ),
    description: translate.instant(
      'storybook.palette.application.oceanBlue.muted.description',
    ),
    modifier: 'muted',
  },
];

export const getRoyalBlueApplicationData = (translate: TranslateService) => [
  {
    title: translate.instant(
      'storybook.palette.application.royalBlue.primary.title',
    ),
    description: translate.instant(
      'storybook.palette.application.royalBlue.primary.description',
    ),
    modifier: 'primary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.royalBlue.accent.title',
    ),
    description: translate.instant(
      'storybook.palette.application.royalBlue.accent.description',
    ),
    modifier: 'secondary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.royalBlue.muted.title',
    ),
    description: translate.instant(
      'storybook.palette.application.royalBlue.muted.description',
    ),
    modifier: 'muted',
  },
];

export const getDeepBlueApplicationData = (translate: TranslateService) => [
  {
    title: translate.instant(
      'storybook.palette.application.deepBlue.primary.title',
    ),
    description: translate.instant(
      'storybook.palette.application.deepBlue.primary.description',
    ),
    modifier: 'primary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.deepBlue.accent.title',
    ),
    description: translate.instant(
      'storybook.palette.application.deepBlue.accent.description',
    ),
    modifier: 'secondary',
  },
  {
    title: translate.instant(
      'storybook.palette.application.deepBlue.muted.title',
    ),
    description: translate.instant(
      'storybook.palette.application.deepBlue.muted.description',
    ),
    modifier: 'muted',
  },
];

export const getColorApplication = (translate: TranslateService) => ({
  oceanblue: getOceanBlueApplicationData(translate),
  royalblue: getRoyalBlueApplicationData(translate),
  deepblue: getDeepBlueApplicationData(translate),
});

export const getNotesData = (translate: TranslateService): Note[] => [
  {
    id: '1',
    title: translate.instant(
      'storybook.palette.notes.items.highContrast.title',
    ),
    description: translate.instant(
      'storybook.palette.notes.items.highContrast.description',
    ),
    icon: 'high-contrast',
  },
  {
    id: '2',
    title: translate.instant(
      'storybook.palette.notes.items.consistentHierarchy.title',
    ),
    description: translate.instant(
      'storybook.palette.notes.items.consistentHierarchy.description',
    ),
    icon: 'consistent-hierarchy',
  },
  {
    id: '3',
    title: translate.instant(
      'storybook.palette.notes.items.flexibleApplication.title',
    ),
    description: translate.instant(
      'storybook.palette.notes.items.flexibleApplication.description',
    ),
    icon: 'flexible-application',
  },
  {
    id: '4',
    title: translate.instant(
      'storybook.palette.notes.items.easySwitching.title',
    ),
    description: translate.instant(
      'storybook.palette.notes.items.easySwitching.description',
    ),
    icon: 'easy-switching',
  },
];
