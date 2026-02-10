export interface PaybillTransactionMeta {
  serviceId: string;
  senderAccountId: string;
  identification: Record<string, string>;
}

export interface IPaybillTransactions {
  id: string;
  amount: number;
  description: string;
  meta: PaybillTransactionMeta;
}