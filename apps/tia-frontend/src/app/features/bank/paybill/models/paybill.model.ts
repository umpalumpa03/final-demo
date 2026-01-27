export interface PaybillProvider {
  serviceId: string;
  serviceName: string;
  category: string;
  name?:string;
}

export interface PaybillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  servicesQuantity: number;

  iconBgColor?: string;
  iconBgPath?: string;
  providers?: PaybillProvider[];
}

export interface PaybillState {
  categories: PaybillCategory[];
  providers: PaybillProvider[];
  selectedCategoryId: string | null;
  selectedProviderId: string | null;
  loading: boolean;
  error: string | null;
}
