export interface PaybillProvider {
  id: string;
  name: string;
  logo?: string;
}

export interface PaybillCategory {
  id: string;
  label: string;
  icon: string;
  providers: PaybillProvider[];
}

export interface PaybillState {
  categories: PaybillCategory[];

  selectedCategoryId: string | null;

  selectedProviderId: string | null;

  loading: boolean;
  error: string | null;
}
