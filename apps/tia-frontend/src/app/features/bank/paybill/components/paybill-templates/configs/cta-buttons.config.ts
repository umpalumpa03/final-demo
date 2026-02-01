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
    submitType: 'default',
    fields: [
      {
        type: 'text',
        label: 'Group Name',
        placeholder: 'e.g., Home Bills, Office Expenses',
        controlName: 'name',
        required: true,
      },
    ],
  },

  [ModalType.RenameGroup]: {
    title: 'Rename Group',
    subtitle: 'Enter a new name for this group',
    submitLabel: 'Rename Group',
    submitType: 'default',
    fields: [
      {
        type: 'text',
        label: 'New Group Name',
        placeholder: 'Enter new name',
        controlName: 'name',
        required: true,
      },
    ],
  },

  [ModalType.DeleteGroup]: {
    title: 'Delete Group',
    subtitle: 'Are you sure you want to delete this group?',
    submitLabel: 'Delete Group',
    submitType: 'destructive',
  },

  [ModalType.Template]: {
    title: 'Create New Template',
    subtitle: 'Create a new payment template for quick access',
    submitLabel: 'Create Template',
    submitType: 'default',
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
        type: 'text',
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
  },

  [ModalType.RenameTemplate]: {
    title: 'Rename Template',
    subtitle: 'Enter a new name for this template',
    submitLabel: 'Rename Template',
    submitType: 'default',
    fields: [
      {
        type: 'text',
        label: 'New Template Name',
        placeholder: 'Enter new name',
        controlName: 'name',
        required: true,
      },
    ],
  },

  [ModalType.DeleteTemplate]: {
    title: 'Delete Template',
    subtitle: 'Are you sure you want to delete this template?',
    submitLabel: 'Delete Template',
    submitType: 'destructive',
  },

  [ModalType.ConfirmPayment]: {
    title: 'Confirm Batch Payment',
    subtitle: 'Review selected bills before payment',
    submitLabel: 'Confirm & Pay All',
    submitType: 'default',
  },
} as const;
