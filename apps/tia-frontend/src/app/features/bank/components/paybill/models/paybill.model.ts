export interface PaybillProvider {
  id: string;
  name: string;
  logo: string;
}

export interface PaybillCategory {
  id: string;
  label: string;
  icon: string;
  providers: PaybillProvider[];
}
