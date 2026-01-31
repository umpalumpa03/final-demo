export interface Theme {
  title: string;
  subtitle: string;
  themeKey: string;
  cssVariable: string;
}

export const themes: Theme[] = [
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
];

/**
 * Gets the computed color value from a CSS variable for a specific theme
 */
export function getThemeColor(themeKey: string, cssVariable: string): string {
  // Create a temporary element with the theme applied
  const tempEl = document.createElement('div');
  tempEl.setAttribute('data-theme', themeKey);
  tempEl.style.display = 'none';
  document.body.appendChild(tempEl);

  const color = getComputedStyle(tempEl).getPropertyValue(cssVariable).trim();
  document.body.removeChild(tempEl);

  return color;
}
