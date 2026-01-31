import { ITheme } from "../models/appearance.model";

export const themesConfig: ITheme[] = [
  {
    displayName: 'Ocean Blue',
    subtitle: 'Light and refreshing blue theme',
    value: 'oceanBlue',
  },
  {
    displayName: 'Royal Blue',
    subtitle: 'Classic and elegant blue theme',
    value: 'royalBlue',
  },
  {
    displayName: 'Deep Blue',
    subtitle: 'Rich and sophisticated blue theme',
    value: 'deepBlue',
  },
] as const;