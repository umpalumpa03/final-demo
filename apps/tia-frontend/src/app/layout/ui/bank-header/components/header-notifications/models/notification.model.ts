export interface HasUnreadNotifications {
  hasUnread: boolean;
}

export interface ItemsData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  actionUrl: string;
  metadata: null;
  createdAt: string;
}

interface PageData {
  hasNext: boolean;
  hasPrev?: boolean;
  nextCursor: string;
  prevCursor?: null;
}

export interface NotificationsData {
  items: ItemsData[];
  pageInfo: PageData;
}

export interface NotificationsState {
  items: ItemsData[];
  pageInfo: PageData;
  isLoading: boolean;
  hasError: boolean;
  limitPerPage: number;
  hasUnread: boolean;
  isFetching: boolean;
  selectedItems: string[];
  unreadCount: number;
}

export type FetchParams = {
  cursor?: string;
  limit: number;
};

export type successMessage = {
  success: boolean;
};

export type UnreadCount = {
  count: number;
};
