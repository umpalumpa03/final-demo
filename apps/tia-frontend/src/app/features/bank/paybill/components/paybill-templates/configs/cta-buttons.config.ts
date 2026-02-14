import {
  CrudActionType,
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
    title: 'paybill.templates.modals.createGroup.title',
    subtitle: 'paybill.templates.modals.createGroup.description',
    submitLabel: 'paybill.templates.modals.createGroup.actionButton',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'paybill.templates.modals.createGroup.nameLabel',
        placeholder: 'e.g., Home Bills, Office Expenses',
        controlName: 'name',
        required: true,
      },
    ],
    formGroupName: 'createGroupForm',
    formSubmitType: 'create-group',
  },

  [ModalType.RenameGroup]: {
    title: 'paybill.templates.modals.renameGroup.title',
    subtitle: 'paybill.templates.modals.renameGroup.description',
    submitLabel: 'paybill.templates.modals.renameGroup.actionButton',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'paybill.templates.modals.renameGroup.currentNameLabel',
        controlName: 'currentName',
      },
      {
        type: 'text',
        label: 'paybill.templates.modals.renameGroup.newNameLabel',
        placeholder: 'paybill.templates.modals.renameGroup.placeholder',
        controlName: 'name',
        required: true,
      },
    ],
    formSubmitType: 'rename-group',
    formGroupName: 'editGroup',
    submitAction: CrudActionType.RenameGroup,
  },

  [ModalType.DeleteGroup]: {
    title: 'paybill.templates.modals.deleteGroup.title',
    subtitle: 'paybill.templates.modals.deleteGroup.description',
    submitLabel: 'paybill.templates.modals.deleteGroup.actionButton',
    submitButtonType: 'destructive',
    formSubmitType: 'delete-group',
    submitAction: CrudActionType.DeleteGroup,
    description: 'paybill.templates.modals.deleteGroup.instruction',
  },

  [ModalType.Template]: {
    title: 'paybill.templates.modals.createTemplate.title',
    subtitle: 'paybill.templates.modals.createTemplate.description',
    submitLabel: 'paybill.templates.modals.createTemplate.actionButton',
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
    ],
    formSubmitType: 'create-template',
  },

  [ModalType.RenameTemplate]: {
    title: 'paybill.templates.modals.renameTemplate.title',
    subtitle: 'paybill.templates.modals.renameTemplate.description',
    submitLabel: 'paybill.templates.modals.renameTemplate.actionButton',
    submitButtonType: 'default',
    fields: [
      {
        type: 'text',
        label: 'paybill.templates.modals.renameTemplate.currentNameLabel',
        controlName: 'currentName',
      },
      {
        type: 'text',
        label: 'paybill.templates.modals.renameTemplate.newNameLabel',
        placeholder: 'paybill.templates.modals.renameTemplate.placeholder',
        controlName: 'name',
        required: true,
      },
    ],
    formSubmitType: 'rename-template',
    formGroupName: 'editTemplate',
    submitAction: CrudActionType.RenameTemplate,
  },

  [ModalType.DeleteTemplate]: {
    title: 'paybill.templates.modals.deleteTemplate.title',
    subtitle: 'paybill.templates.modals.deleteTemplate.description',
    submitLabel: 'paybill.templates.modals.deleteTemplate.actionButton',
    submitButtonType: 'destructive',
    submitAction: CrudActionType.DeleteTemplate,
    formSubmitType: 'delete-template',
  },

  [ModalType.ConfirmPayment]: {
    title: 'paybill.templates.modals.confitmPayment.title',
    subtitle: 'paybill.templates.modals.confitmPayment.description',
    submitLabel: 'paybill.templates.modals.confitmPayment.actionButton',
    submitButtonType: 'default',
    submitAction: CrudActionType.ConfirmPayment,
    formSubmitType: 'confirm-payment',
  },
} as const;
