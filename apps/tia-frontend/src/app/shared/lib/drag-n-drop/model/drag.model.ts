export interface DraggableItemType {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface KanbanItem extends DraggableItemType {
  boardId: string;
  order: number;
}

export interface BoardConfig {
  id: string;
  title: string;
}

export interface CardMovedEvent {
  cardId: string;
  fromBoardId: string;
  toBoardId: string;
  newOrder: number;
}

export interface CardReorderedEvent {
  cardId: string;
  boardId: string;
  newOrder: number;
}
export type LayoutType = 'grid' | 'list';
