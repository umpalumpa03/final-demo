import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApproveAccountsContainer } from '../container/approve-accounts-container';
import { AccountPermissionsStore } from '../store/approve-accounts.store';
import { ApproveAccountsConfig } from '../config/approve-accounts.config';
import { createApproveAccountsMocks } from './approve-accounts.test-helpers';
import { ReactiveFormsModule } from '@angular/forms';

describe('ApproveAccountsContainer Integration', () => {
  let component: ApproveAccountsContainer;
  let fixture: ComponentFixture<ApproveAccountsContainer>;
  let mocks: ReturnType<typeof createApproveAccountsMocks>;

  beforeEach(async () => {
    mocks = createApproveAccountsMocks();

    await TestBed.configureTestingModule({
      imports: [ApproveAccountsContainer, ReactiveFormsModule],
    })
      .overrideComponent(ApproveAccountsContainer, {
        set: {
          providers: [
            { provide: AccountPermissionsStore, useValue: mocks.store },
            { provide: ApproveAccountsConfig, useValue: mocks.config },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ApproveAccountsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    fixture.destroy();
  });

  it('should load initial data on ngOnInit', () => {
    expect(mocks.store.loadPermissions).toHaveBeenCalled();
    expect(mocks.store.loadPendingAccounts).toHaveBeenCalled();
  });

  it('should open permissions modal when "permissions" action is triggered', () => {
    const mockId = 'acc_123';

    component.handleAction({ action: 'permissions', id: mockId });

    expect(component.activeAccountId()).toBe(mockId);
    expect(component.permissionsOverlay()).toBe(true);
  });

  it('should call store.updateStatus with "active" when account is approved', () => {
    const mockId = 'acc_456';

    component.handleAction({ action: 'approve', id: mockId });

    expect(mocks.store.updateStatus).toHaveBeenCalledWith({
      accountId: mockId,
      updatedStatus: 'active',
    });
  });

  it('should call store.updateStatus with "closed" when account is declined', () => {
    const mockId = 'acc_789';

    component.handleAction({ action: 'decline', id: mockId });

    expect(mocks.store.updateStatus).toHaveBeenCalledWith({
      accountId: mockId,
      updatedStatus: 'closed',
    });
  });

  it('should compute the correct full name for the active account', () => {
    const mockAccount = {
      id: '1',
      user: { firstName: 'Giorgi', lastName: 'Zviadauri' },
    } as any;

    mocks.store.pendingAccounts.set([mockAccount]);
    component.activeAccountId.set('1');

    expect(component.fullName()).toBe('Giorgi Zviadauri');
  });

  it('should reset permissions form and close modal when closeModal is called', () => {
    component.activeAccountId.set('acc_123');
    component.permissionsSavedAccount.set(null);

    component.permissionsOverlay.set(true);

    const resetSpy = vi.spyOn(component.permissionsForm, 'reset');

    component.closeModal();

    expect(component.permissionsOverlay()).toBe(false);
    expect(resetSpy).toHaveBeenCalled();
  });
});
