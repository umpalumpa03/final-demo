import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PendingApprovalsTable } from './pending-approvals-table';
import { PendingApproval } from '../../shared/models/loan-management.model';

describe('PendingApprovalsTable', () => {
  let component: PendingApprovalsTable;
  let fixture: ComponentFixture<PendingApprovalsTable>;

  const mockApprovals: PendingApproval[] = [
    {
      id: 'loan-1',
      userFullName: 'John Doe',
      userEmail: 'john@example.com',
      loanAmount: 50000,
      loanPurpose: 'home_improvement',
      loanTerm: 36,
      requestDate: '2024-01-15T10:00:00Z',
      status: 'pending',
    },
    {
      id: 'loan-2',
      userFullName: 'Jane Smith',
      userEmail: 'jane@example.com',
      loanAmount: 75000,
      loanPurpose: 'debt_consolidation',
      loanTerm: 48,
      requestDate: '2024-01-16T14:30:00Z',
      status: 'pending',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalsTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('approvals', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('computed properties', () => {
    it('should calculate hasApprovals correctly', () => {
      fixture.componentRef.setInput('approvals', []);
      fixture.detectChanges();
      expect(component.hasApprovals()).toBe(false);

      fixture.componentRef.setInput('approvals', mockApprovals);
      fixture.detectChanges();
      expect(component.hasApprovals()).toBe(true);
    });

    it('should show empty state when no approvals, not loading, and no error', () => {
      fixture.componentRef.setInput('approvals', []);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      expect(component.showEmptyState()).toBe(true);
    });

    it('should not show empty state when loading', () => {
      fixture.componentRef.setInput('approvals', []);
      fixture.componentRef.setInput('isLoading', true);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      expect(component.showEmptyState()).toBe(false);
    });

    it('should show error when error exists and not loading', () => {
      fixture.componentRef.setInput('approvals', []);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('error', 'Failed to load');
      fixture.detectChanges();

      expect(component.showError()).toBe(true);
    });

    it('should show list when has approvals, not loading, and no error', () => {
      fixture.componentRef.setInput('approvals', mockApprovals);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      expect(component.showList()).toBe(true);
    });

    it('should not show list when loading', () => {
      fixture.componentRef.setInput('approvals', mockApprovals);
      fixture.componentRef.setInput('isLoading', true);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();

      expect(component.showList()).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('should return initials from full name', () => {
      expect(component.getInitials('John Doe')).toBe('JD');
      expect(component.getInitials('Jane Mary Smith')).toBe('JM');
      expect(component.getInitials('Alice')).toBe('A');
    });

    it('should return empty string for empty name', () => {
      expect(component.getInitials('')).toBe('');
    });

    it('should return uppercase initials', () => {
      expect(component.getInitials('john doe')).toBe('JD');
    });

    it('should limit to 2 characters', () => {
      expect(component.getInitials('John Paul George Ringo')).toBe('JP');
    });
  });

  describe('actions', () => {
    it('should emit rowClick event with loan ID when onRowClick is called', () => {
      const rowClickSpy = vi.fn();
      component.rowClick.subscribe(rowClickSpy);

      component.onRowClick('loan-123');

      expect(rowClickSpy).toHaveBeenCalledWith('loan-123');
    });

    it('should emit reload event when onReload is called', () => {
      const reloadSpy = vi.fn();
      component.reload.subscribe(reloadSpy);

      component.onReload();

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('pendingIcon', () => {
    it('should have pendingIcon defined', () => {
      expect(component.pendingIcon).toBeDefined();
    });
  });
});
