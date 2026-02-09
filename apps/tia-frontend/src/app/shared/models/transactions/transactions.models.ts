import { Currency, TransactionCategoryInterface } from './base.models';

export interface ITransactions {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  transferType: 'BillPayment' | 'ToSomeoneSameBank' | 'ToSomeoneOtherBank' | 'Loan' | string;
  currency: Currency;
  description: string;
  debitAccountNumber: string;
  creditAccountNumber: string | null;
  category: TransactionCategoryInterface | string;
  meta?: Record<string, string> | null;
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

export interface ICategoryPostResponse {
  id: string;
  userId: string;
  categoryName: string;
  createdAt: string;
}
