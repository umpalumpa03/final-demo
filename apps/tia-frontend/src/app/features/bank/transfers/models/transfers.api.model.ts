export interface TransferSameBankPayload {
    senderAccountId: string;
    receiverAccountIban: string;
    description: string;
    amountToSend: number;
  }
  
  export interface TransferToOwnPayload {
    senderAccountId: string;
    receiverAccountId: string;
    description: string;
    amountToSend: number;
  }
  
  export interface TransferCrossCurrencyPayload {
    senderAccountId: string;
    receiverAccountId: string;
    description: string;
    amountToSend: number;
    isReverse: boolean;
  }
  
  export interface TransferExternalBankPayload {
    senderAccountId: string;
    receiverAccountIban: string;
    receiverAccountCurrency: string;
    receiverName: string;
    amountToSend: number;
    description: string;
  }
  
  export interface TransferVerifyPayload {
    challengeId: string;
    code?: string;
  }
  
  export interface ConversionRateResponse {
    success: boolean;
    query: { from: string; to: string; amount: number };
    result: number;
    rate: number;
  }