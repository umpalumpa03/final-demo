import { TransferMeta } from '../models/transfer.external.model';

export const sameBankMock: TransferMeta = {
  recipientIban: 'GE00TIAFB745FA2CB1C52F',
  senderAccountId: 'a1000001-0001-4000-8000-000000000001',
  amount: 20,
  description: 'transfer in own bank',
};

export const externalBankMock: TransferMeta = {
  recipientIban: 'GE00GNFB745FA2CB1C52F',
  senderAccountId: 'a1000001-0001-4000-8000-000000000001',
  recipientName: 'mariam svanidze',
  amount: 20,
  description: 'just some string',
};
