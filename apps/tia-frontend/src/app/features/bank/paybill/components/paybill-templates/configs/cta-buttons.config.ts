import {
  HeaderCtaAction,
  HeaderCtaButton,
  ModalInfo,
  ModalType,
} from '../models/paybill-templates.model';

export const HeaderCtaConfig: HeaderCtaButton[] = [
  {
    action: HeaderCtaAction.SelectAll,
    variant: 'outline',
    textKey: 'paybill.templates.selectButton',
  },
  {
    action: HeaderCtaAction.CreateTemplate,
    variant: 'outline',
    textKey: 'paybill.templates.createTemplate',
  },
  {
    action: HeaderCtaAction.CreateGroup,
    variant: 'default',
    textKey: 'paybill.templates.createGroup',
  },
] as const;

export const ModalConfig: Record<ModalType, ModalInfo> = {
  [ModalType.Group]: {
    title: 'Create New Group',
    subtitle: 'Create a group to organize your bill payment templates',
    submitLabel: 'Create Group',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'Group Name',
        placeholder: 'e.g., Home Bills, Office Expenses',
        controlName: 'name',
        required: true,
      },
    ],
    formGroupName: 'createGroupForm',
    formSubmitType: 'create-group',
  },

  [ModalType.RenameGroup]: {
    title: 'Rename Group',
    subtitle: 'Enter a new name for this group',
    submitLabel: 'Rename Group',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'New Group Name',
        placeholder: 'Enter new name',
        controlName: 'name',
        required: true,
      },
    ],
    formSubmitType: 'create-group',
    submitAction: 'renameGroup',
  },

  [ModalType.DeleteGroup]: {
    title: 'Delete Group',
    subtitle: 'Are you sure you want to delete this group?',
    submitLabel: 'Delete Group',
    submitButtonType: 'destructive',
    formSubmitType: 'create-group',
    submitAction: 'deleteGroup',
  },

  [ModalType.Template]: {
    title: 'Create New Template',
    subtitle: 'Create a new payment template for quick access',
    submitLabel: 'Create Template',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'Template Name *',
        placeholder: 'e.g., Home Electricity',
        controlName: 'name',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'Category *',
        placeholder: 'Select category',
        controlName: 'category',
        required: true,
      },
      {
        type: 'dropdown',
        label: 'Service Provider *',
        placeholder: 'e.g., Power Company',
        controlName: 'serviceProvider',
        required: true,
      },
      {
        type: 'text',
        label: 'Account Number *',
        placeholder: 'Enter account number',
        controlName: 'accountNumber',
        required: true,
      },
    ],
    formSubmitType: 'create-group',
  },

  [ModalType.RenameTemplate]: {
    title: 'Rename Template',
    subtitle: 'Enter a new name for this template',
    submitLabel: 'Rename Template',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'New Template Name',
        placeholder: 'Enter new name',
        controlName: 'name',
        required: true,
      },
    ],
    formSubmitType: 'create-group',
    submitAction: 'renameTemplate',
  },

  [ModalType.DeleteTemplate]: {
    title: 'Delete Template',
    subtitle: 'Are you sure you want to delete this template?',
    submitLabel: 'Delete Template',
    submitButtonType: 'destructive',
    submitAction: 'deleteTemplate',
    formSubmitType: 'create-group',
  },

  [ModalType.ConfirmPayment]: {
    title: 'Confirm Batch Payment',
    subtitle: 'Review selected bills before payment',
    submitLabel: 'Confirm & Pay All',
    submitButtonType: 'default',
    submitAction: 'confirmPayment',
    formSubmitType: 'create-group',
  },
} as const;
