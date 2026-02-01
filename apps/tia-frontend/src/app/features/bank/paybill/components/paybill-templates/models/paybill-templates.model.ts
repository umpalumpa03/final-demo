import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

export interface TemplateGroups {
  id: string;
  groupName: string;
  templateCount: number;
}

export enum ModalType {
  Group = 'group',
  RenameGroup = 'renameGroup',
  DeleteGroup = 'deleteGroup',
  Template = 'template',
  RenameTemplate = 'renameTemplate',
  DeleteTemplate = 'deleteTemplate',
  ConfirmPayment = 'confirmPayment',
}

export interface ModalField {
  type: 'text' | 'dropdown';
  label: string;
  placeholder: string;
  controlName: string;
  required?: boolean;
}

export interface ModalInfo {
  title: string;
  subtitle: string;
  submitLabel: string;
  submitType: ButtonVariant;
  fields?: ModalField[];
}

export enum HeaderCtaAction {
  SelectAll = 'selectAll',
  CreateTemplate = 'createTemplate',
  CreateGroup = 'createGroup',
}

export interface HeaderCtaButton {
  action: HeaderCtaAction;
  variant: 'outline' | 'default';
  textKey: string;
}
