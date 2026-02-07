import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';

export type IWidgetTypes = 'transactions' | 'accounts' | 'exchange';

export interface IWidgetItem extends DraggableItemType {
  widgetName?: string; 
  dbId?: string;       
  isActive?: boolean;  
  order?: number;      
  type?: IWidgetTypes;
  isHidden?: boolean;  
  hasFullWidth?: boolean;
  hasPagination?: boolean;
  hasAdd?: boolean;
  hasButton?: boolean;
}
