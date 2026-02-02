import { Currency, TransactionCategoryInterface } from "./base.models";


export interface ITransactions  {
  id: string;
  userId: string;
  amount: number;
  transactionType: string;
  transferType: string;
  currency: Currency;
  description: string;
  debitAccountNumber: string;
  creditAccountNumber: string | null;
  category: TransactionCategoryInterface | string;
  convertionInfo?: ConvertionInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ConvertionInfo {
  rate: number;
  finalAmount: number;
}

export interface ITransactionFilter {
  searchCriteria?: string;
  amountFrom?: number;
  amountTo?: number;
  iban?: string;
  accountIban?: string;
  currency?: Currency;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  pageCursor?: string;
  pageLimit?: number;
}
export interface PageInfo {
  hasNextPage: boolean;
  nextCursor: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: PageInfo;
}
