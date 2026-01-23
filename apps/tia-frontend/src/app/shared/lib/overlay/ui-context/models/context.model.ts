export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: string;
  variant?: 'default' | 'danger';
}

export interface ContextMenuViewModel extends ContextMenuItem {
  iconPath?: string;
}
