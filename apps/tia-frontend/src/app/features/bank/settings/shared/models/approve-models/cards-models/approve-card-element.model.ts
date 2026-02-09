export type CardAction = 'permissions' | 'approve' | 'decline';

export interface ActionButton {
  id: CardAction;
  label: string;
  icon: string;
}

export interface buttonEmit {
  action: CardAction;
  id: string;
}
