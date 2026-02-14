export interface ITheme {
  value: string;
  displayName: string;
  subtitle?: string;
}

export type TAvailableThemes = ITheme[];

export interface ResponceTheme {
  value: string;
  displayName: string;
}

export interface AppearanceState {
  themes: { value: string; displayName: string; subtitle: string }[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  hasLoaded: boolean;
}
