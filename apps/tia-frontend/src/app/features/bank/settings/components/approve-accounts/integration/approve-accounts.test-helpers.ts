import { vi } from 'vitest';
import { signal } from '@angular/core';

export const createApproveAccountsMocks = () => {
  return {
    store: {
      loadPermissions: vi.fn(),
      loadPendingAccounts: vi.fn(),
      updateStatus: vi.fn(),
      savePermissions: vi.fn(),
      selectAccount: vi.fn(),

      pendingAccounts: signal<any[]>([]),
      permissions: signal<any[]>([]),
      isLoading: signal(false),
      error: signal<string | null>(null),
      selectedAccountId: signal<string | null>(null),
    },
    config: {
      textConfig: signal({
        card: {
          title: 'Approve Accounts',
          subtitle: 'Manage pending requests',
        },
        errorState: {
          header: 'No accounts',
          message: 'Everything is approved',
        },
        permissionsModal: { modalTitle: 'Permissions', title: 'Edit' },
        confirmDialog: {
          title: 'Are you sure?',
          cancelBtn: 'No',
          confirmBtn: 'Yes',
        },
      }),
    },
  };
};
