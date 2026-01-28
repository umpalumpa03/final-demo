export interface PrepaymentOption {
  isActive: boolean;
  prepaymentValue: string;
  prepaymentDisplayName: string;
}

export interface IPrepaymentResponse {
  prepaymentOptions: PrepaymentOption[];
}
