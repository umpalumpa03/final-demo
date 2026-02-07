import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';

export interface IWidgetItem extends DraggableItemType {
  type?: 'transactions' | 'accounts' | 'exchange';
  hasPagination?: boolean;
  hasAdd?: boolean;
  hasButton?: boolean;
  hasFullWidth?: boolean;
  isHidden?: boolean;
  dbId?: string;
  order?: number;
  isActive?: boolean;
}
