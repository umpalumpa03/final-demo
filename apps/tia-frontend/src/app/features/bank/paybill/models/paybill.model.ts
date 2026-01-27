export interface PaybillProvider {
  id: string;
  name: string;
  logo?: string;
}

export interface PaybillCategory {
  id: string;
  name: string;
  icon: string;
  iconBgColor?: string;
  description: string;
  providers: PaybillProvider[];
  count?: number;
  iconBgPath?: string;
}

export interface PaybillState {
  categories: PaybillCategory[];

  selectedCategoryId: string | null;

  selectedProviderId: string | null;

  loading: boolean;
  error: string | null;
}

export interface PaybillBreadcrumb {
  label: string;
  route: string;
  command?: () => void;
}
