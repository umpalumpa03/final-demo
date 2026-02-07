export interface IWidgetPayload {
  id: string;
  userId: string;
  widgetName: string;
  hasFullWidth: boolean;
  order: number;
  isActive: boolean;
  isCollapsed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWidgetUpdatePayload {
  isActive?: boolean;
  widgetName?: string;
  hasFullWidth?: boolean;
  order?: number;
}