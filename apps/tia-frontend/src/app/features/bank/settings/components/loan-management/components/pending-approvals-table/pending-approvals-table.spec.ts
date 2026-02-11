import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { PendingApprovalsTable } from './pending-approvals-table';
import { PendingApproval } from '../../shared/models/loan-management.model';

describe('PendingApprovalsTable', () => {
  let component: PendingApprovalsTable;
  let fixture: ComponentFixture<PendingApprovalsTable>;

  const mockApprovals: PendingApproval[] = [
    {
      id: 'loan-1',
      userId: 'user-1',
      userFullName: 'John Doe',
      loanAmount: 50000,
      accountId: 'acc-1',
      months: 36,
      purpose: 'home_improvement',
      status: 1,
      statusName: 'pending',
      address: { street: '123 Main St', city: 'Test', region: 'Test', postalCode: '12345' },
      contactPerson: { name: 'Jane', relationship: 'spouse', phone: '555-0100', email: 'jane@test.com' },
      createdAt: '2024-01-15T10:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsTable, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalsTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('approvals', []);
    fixture.detectChanges();
  });

  it('hasApprovals should return true when approvals exist and false when empty', () => {
    expect(component.hasApprovals()).toBe(false);

    fixture.componentRef.setInput('approvals', mockApprovals);
    fixture.detectChanges();
    expect(component.hasApprovals()).toBe(true);
  });

  it('showEmptyState should be true only when not loading, no error, and no approvals', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('approvals', []);
    fixture.detectChanges();
    expect(component.showEmptyState()).toBe(true);

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.showEmptyState()).toBe(false);
  });

  it('showError should be true when error exists and not loading', () => {
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', 'Failed to load');
    fixture.detectChanges();
    expect(component.showError()).toBe(true);
  });

  it('showList should be true when has approvals, not loading, and no error', () => {
    fixture.componentRef.setInput('approvals', mockApprovals);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();
    expect(component.showList()).toBe(true);
  });

  it('getInitials should extract uppercase initials from a full name, limited to 2 characters', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice')).toBe('A');
    expect(component.getInitials('')).toBe('');
  });

  it('onRowClick should emit rowClick with the given loan ID', () => {
    const spy = vi.fn();
    component.rowClick.subscribe(spy);
    component.onRowClick('loan-123');
    expect(spy).toHaveBeenCalledWith('loan-123');
  });

  it('onReload should emit reload event', () => {
    const spy = vi.fn();
    component.reload.subscribe(spy);
    component.onReload();
    expect(spy).toHaveBeenCalled();
  });
});
