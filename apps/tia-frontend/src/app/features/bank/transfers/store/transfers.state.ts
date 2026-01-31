import { TransferState } from '../models/transfers.state.model';

export const initialTransferState: TransferState = {
  recipientInput: '',
  amount: 0,
  description: '',
  manualRecipientName: '',
  senderAccount: null,
  receiverOwnAccount: null,
  selectedRecipientAccount: null,
  recipientInfo: null,
  transferId: null,
  challengeId: null,
  fee: 0,
  recipientType: null,
  requiresOTP: false,
  currentStep: 1,
  isLoading: false,
  error: null,
};
