import { ActionButton } from "../shared/model/approve-card-element.model";

export const APPROVE_CARD_BUTTONS: ActionButton[] = [
  { id: 'permissions', label: 'settings.approve-cards.buttons.permissions', icon: 'permissions.svg' },
  { id: 'approve', label: 'settings.approve-cards.buttons.approve', icon: 'approve.svg' },
  { id: 'decline', label: 'settings.approve-cards.buttons.decline', icon: 'decline.svg' }
] as const;
// export const APPROVE_CARD_BUTTONS: ActionButton[] = [
//   { id: 'permissions', label: 'Permissions', icon: 'permissions.svg' },
//   { id: 'approve', label: 'Approve', icon: 'approve.svg' },
//   { id: 'decline', label: 'Decline', icon: 'decline.svg' }
// ] as const;
