export interface ILanguage {
  value: string;
  displayName: string;
}

export type TLanguages = ILanguage[];

export interface Language {
  id: string;
  value: string;
  name: string;
  nativeName: string;
  region: string;
  speakerCount: string;
  flagUrl: string;
}

export interface LanguagesState {
  languages: Language[];
  isLoading: boolean;
  hasError: boolean;
}
