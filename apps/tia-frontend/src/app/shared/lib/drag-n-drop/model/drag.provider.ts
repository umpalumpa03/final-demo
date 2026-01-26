import { InjectionToken, Signal } from '@angular/core';
import { LayoutType } from './drag.model';

//  This token acts as a "bridge" to break circular dependencies by
//  allowing child items to communicate with their parent container without
//  needing to import the parent's component class directly.

export interface DragContainerProvider {
  draggingId: Signal<string | null>;
  dropTargetId: Signal<string | null>;
  draggingStyle: Signal<{ transform: string; zIndex: number }>;
  layout: Signal<LayoutType>;
  getColspanForItem(id: string): string | null;
}

export const DRAG_CONTAINER = new InjectionToken<DragContainerProvider>(
  'DRAG_CONTAINER',
);
