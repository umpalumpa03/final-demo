export interface IFeaturePanel {
  id?: number;
  title: string;
  text: string;
  icon?: string;
}

export type AuthFromType = 'sign-in' | 'sign-up' | 'forgot-password' | 'unknown'
