export type PrepaymentType = 'partial' | 'full';

export interface IPrepaymentOption {
  isActive: boolean;
  prepaymentValue: PrepaymentType;
  prepaymentDisplayName: string;
}
