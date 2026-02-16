import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAccountsContainer } from './approve-accounts-container';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IAccountsPermissions } from '../../../shared/models/approve-models/accounts-models/account-permissions.models';
import { BankAccount } from '../../../shared/models/approve-models/accounts-models/pending-accounts.models';
import { AccountPermissionsStore } from '../store/approve-accounts.store';
import { ApproveAccountsConfig } from '../config/approve-accounts.config';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('ApproveAccountsContainer', () => {
  let component: ApproveAccountsContainer;
  let fixture: ComponentFixture<ApproveAccountsContainer>;
  let mockStore: any;

  const mockConfig = {
    textConfig: signal({
      card: { title: 'Test', subtitle: 'Test' },
      errorState: { header: 'Error', message: 'Msg' },
      permissionsModal: {
        modalTitle: 'Title',
        modalSubtitle: 'Sub',
        title: 'T',
        saveAction: 'Save',
        cancelAction: 'Cancel',
        ofLabel: 'of',
        enabledSuffix: 'enabled',
      },
      confirmDialog: {
        title: 'C',
        subtitle: 'S',
        cancelBtn: 'No',
        confirmBtn: 'Yes',
      },
    }),
  };

  beforeEach(async () => {
    mockStore = {
      permissions: signal<IAccountsPermissions[]>([]),
      pendingAccounts: signal<BankAccount[]>([]),
      isLoading: signal(false),
      error: signal(null),
      loadPermissions: vi.fn(),
      loadPendingAccounts: vi.fn(),
      savePermissions: vi.fn(),
      updateStatus: vi.fn(),
      selectedAccountId: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [
        ApproveAccountsContainer,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ApproveAccountsContainer, {
        set: {
          providers: [
            { provide: AccountPermissionsStore, useValue: mockStore },
            { provide: ApproveAccountsConfig, useValue: mockConfig },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ApproveAccountsContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init correctly and call load methods', () => {
    expect(component).toBeTruthy();
    expect(mockStore.loadPermissions).toHaveBeenCalled();
    expect(mockStore.loadPendingAccounts).toHaveBeenCalled();
  });

  it('should sync form controls when permissions signal updates', () => {
    mockStore.permissions.set([
      { value: 1, label: 'View Balance' },
      { value: 4, label: 'Transfer' },
    ]);
    fixture.detectChanges();

    const form = component.permissionsForm;
    expect(form.contains('1')).toBe(true);
    expect(form.contains('4')).toBe(true);
    expect(form.contains('2')).toBe(false);
  });

  it('should map permissions correctly for UI', () => {
    mockStore.permissions.set([
      { value: 1, label: 'View Balance' },
      { value: 2, label: 'Transfer' },
    ]);
    fixture.detectChanges();

    const mapped = component.mappedPermissions();
    expect(mapped.length).toBe(2);
    expect(mapped[0].label).toBe('View Balance');
    expect(mapped[0].value).toBe(1);
  });

  it('should correctly compute account details based on activeAccountId', () => {
    const mockAccount = {
      id: 'acc-1',
      name: 'Test Business',
      user: { firstName: 'John', lastName: 'Doe' },
    } as any;

    mockStore.pendingAccounts.set([mockAccount]);

    component.activeAccountId.set('acc-1');
    fixture.detectChanges();

    expect(component.accountName()).toBe('Test Business');
    expect(component.fullName()).toBe('John Doe');
  });

  it('should open modal and stage account ID on save', () => {
    const accountId = 'acc-123';

    component.handleAction({ action: 'permissions', id: accountId });

    expect(component.activeAccountId()).toBe(accountId);
    expect(component.permissionsOverlay()).toBe(true);

    component.onSavePermissions();

    expect(component.permissionsSavedAccount()).toBe(accountId);
    expect(component.permissionsOverlay()).toBe(false);
  });

  it('should calculate bitwise sum and save permissions on approve', () => {
    const accountId = 'acc-123';

    mockStore.permissions.set([
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 4, label: 'C' },
    ]);

    fixture.detectChanges();

    component.activeAccountId.set(accountId);
    component.permissionsSavedAccount.set(accountId);

    component.permissionsForm.patchValue({
      '1': true,
      '2': false,
      '4': true,
    });

    component.handleAction({ action: 'approve', id: accountId });

    expect(mockStore.savePermissions).toHaveBeenCalledWith({
      accountId: accountId,
      permissions: 5,
    });

    expect(mockStore.updateStatus).toHaveBeenCalledWith({
      accountId: accountId,
      updatedStatus: 'active',
    });

    expect(component.permissionsSavedAccount()).toBeNull();
  });

  it('should update status to closed on decline', () => {
    const accountId = 'acc-999';
    component.handleAction({ action: 'decline', id: accountId });

    expect(mockStore.updateStatus).toHaveBeenCalledWith({
      accountId: accountId,
      updatedStatus: 'closed',
    });
  });

  it('should call loadPendingAccounts on retry', () => {
    component.retryLoading();
    expect(mockStore.loadPendingAccounts).toHaveBeenCalledTimes(2);
  });

  it('should reset state on cancel changes', () => {
    component.activeAccountId.set('acc-1');
    component.permissionsSavedAccount.set('acc-1');
    component.permissionsOverlay.set(true);

    component.cancelPermissionChanges();

    expect(component.permissionsSavedAccount()).toBeNull();
    expect(component.permissionsOverlay()).toBe(false);
  });

  it('should trigger confirmation modal when switching accounts with unsaved changes', () => {
    component.permissionsSavedAccount.set('acc-1');
    component.handleAction({ action: 'permissions', id: 'acc-2' });

    expect(component.confirmModalActive()).toBe(true);
    expect(component.permissionsOverlay()).toBe(false);
  });

  it('should close confirm modal and reset pending ID on confirm cancel', () => {
    component.confirmModalActive.set(true);
    component.onConfirmCancel();

    expect(component.confirmModalActive()).toBe(false);
  });

  it('should switch account and reset state on confirm accept', () => {
    component.permissionsSavedAccount.set('acc-1');

    component.handleAction({ action: 'permissions', id: 'acc-2' });

    expect(component.confirmModalActive()).toBe(true);

    component.onConfirmAccept();

    expect(component.permissionsSavedAccount()).toBeNull();
    expect(component.confirmModalActive()).toBe(false);
    expect(component.activeAccountId()).toBe('acc-2');
    expect(component.permissionsOverlay()).toBe(true);
  });

  it('should close modal and reset form if account is not saved', () => {
    component.activeAccountId.set('acc-1');
    component.permissionsSavedAccount.set('acc-2');
    component.permissionsOverlay.set(true);

    const resetSpy = vi.spyOn(component.permissionsForm, 'reset');

    component.closeModal();

    expect(component.permissionsOverlay()).toBe(false);
    expect(resetSpy).toHaveBeenCalled();
  });
});
