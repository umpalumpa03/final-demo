export interface CommandAction {
  id: string;
  label: string;
  icon?: string;
  isSuggestion?: boolean;
}

export interface ProcessedCommandAction extends CommandAction {
  fullIconPath?: string;
}

export interface CommandPaletteConfig {
  placeholder?: string;
}
