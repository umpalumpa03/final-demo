import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

export interface TemplateGroups {
  id: string;
  groupName: string;
  templateCount: number;
}

export interface Templates {
  id: string;
  nickname: string;
  serviceId: string;
  identification: {
    accountNumber: string;
  };
  amountDue: number;
  groupId: null | string;
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
  placeholder?: string;
  controlName: string;
  required?: boolean;
}

export interface ModalInfo {
  title: string;
  subtitle: string;
  submitLabel: string;
  submitButtonType: ButtonVariant;
  fields?: ModalField[];
  formGroupName?: string | null;
  formSubmitType: formSubmitType;
  submitAction?: string;
  initialValues?: Record<string, string>;
  description?: string;
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

export type formSubmitType =
  | 'create-group'
  | 'rename-template'
  | 'rename-group';
export interface FormSubmitPayload {
  type: formSubmitType;
  values: Record<string, string>;
}

export interface CreateTemplateGroup {
  groupName: string;
  templateIds: [];
}

export interface CreateTemplateGroupResponse {
  id: string;
  groupName: string;
  templateCount: number;
}

export interface TreeItemMoved {
  itemId: string;
  fromGroupId: string | null;
  toGroupId: string | null;
  newOrder: number;
}
