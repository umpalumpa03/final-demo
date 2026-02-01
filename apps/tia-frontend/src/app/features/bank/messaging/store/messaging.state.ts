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
  searchResults: User[]; 
  isSearching: boolean;
  successMessage?: string;
}

export interface SendEmailRequest {
  subject: string;
  body: string;
  recipient: string;
  ccRecipients?: string[];
  isImportant?: boolean;
  isDraft?: boolean;
}
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export type UserMailsResponse = User[];

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
  searchResults: [],
  isSearching: false,
  successMessage: '',
};
