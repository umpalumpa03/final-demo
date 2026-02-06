export interface IFeaturePanel {
  id?: number;
  title: string;
  text: string;
  icon?: string;
}

export interface IFeature {
  title: string;
  description: string;
  features: IFeaturePanel[];
}

export type TimerType =  "phone" | "otp"