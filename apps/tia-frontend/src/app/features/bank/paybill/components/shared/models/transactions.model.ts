export interface PaybillTransactionMeta {
  serviceId: string;
  senderAccountId: string;
  identification: Record<string, string>;
  categoryId:string;
}

export interface IPaybillTransactions {
  id: string;
  amount: number;
  description: string;
  meta: PaybillTransactionMeta;
}