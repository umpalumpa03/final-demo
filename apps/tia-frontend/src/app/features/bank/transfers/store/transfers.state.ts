import { TransferState } from '../models/transfers.state.model';

export const initialTransferState: TransferState = {
  recipientInput: '', //recipient value number or iban
  amount: 0, //amount written by sender (without fee)
  description: '',
  manualRecipientName: '', //external banks recipient name
  senderAccount: null,
  receiverOwnAccount: null, //for own transfer
  recipientInfo: null, //recipient info after lookup
  selectedRecipientAccount: null, //selected account by number or iban
  hasInsufficientBalance: false, //flag
  isFeeLoading: false,

  challengeId: null,
  fee: 0,
  totalWithFee: 0,
  recipientType: null,
  requiresOtp: false,
  pendingTransferId: null,
  currentStep: 1,
  isVerified: false,
  isLoading: false,
  error: null,
  transferSuccess: false,
};
