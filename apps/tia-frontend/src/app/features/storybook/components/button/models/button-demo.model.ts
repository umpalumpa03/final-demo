import { ButtonVariant } from '../../../../../shared/lib/primitives/button/button.model';


export interface ButtonDemoItem {
  variant: ButtonVariant;
  label: string;
  icon?: string;
}

export interface ButtonGroupDemo {
  simple: {
    count: number;
    labels: string[];
  };
  withActions?: {
    label: string;
    action: () => void;
  }[];
  withNavigation?: {
    label: string;
    routerLink: string;
  }[];
}