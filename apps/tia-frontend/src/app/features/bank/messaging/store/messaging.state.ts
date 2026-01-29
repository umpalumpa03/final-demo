export type MailType = 'inbox' | 'sent' | 'drafts' | 'important' | 'favorites';

export interface Mail {
  id: number;
  subject: string;
  senderEmail: string;
  receiverEmail: string;
  body: string;
  isRead: boolean;
  isImportant: boolean;
  isFavorite: boolean;
  createdAt: string;
  permission: number;
}

export interface MailPagination {
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface MailsResponse {
  items: Mail[];
  pagination: MailPagination;
}

export interface MailingState {
  mails: Mail[];
  currentType: MailType;
  pagination: MailPagination;
  isLoading: boolean;
  isLoadingMore: boolean;
  selectedMailId: number | null;
  error: string | null;
  limit: number;
}

export const initialState: MailingState = {
  mails: [],
  currentType: 'inbox',
  pagination: {
    hasNextPage: false,
    nextCursor: null,
  },
  isLoading: false,
  isLoadingMore: false,
  selectedMailId: null,
  error: null,
  limit: 20,
};
