import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';

export interface IWidgetItem extends DraggableItemType {
  widgetName?: string; 
  dbId?: string;       
  isActive?: boolean;  
  order?: number;      
  type?: 'transactions' | 'accounts' | 'exchange';
  isHidden?: boolean;  
  hasFullWidth?: boolean;
  hasPagination?: boolean;
  hasAdd?: boolean;
  hasButton?: boolean;
}
