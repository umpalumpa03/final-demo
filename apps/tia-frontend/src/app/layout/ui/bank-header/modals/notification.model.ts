export interface HasUnreadNotifications {
  hasUnread: boolean;
}

interface ItemsData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  actionUrl: string;
  metadata: any;
  createdAt: string;
}

interface PageData {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor: string;
  prevCursor: any;
}

export interface NotificationsData {
  items: ItemsData[];
  pageInfo: PageData[];
}
