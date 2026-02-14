import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';
import { PendingApprovalsTable } from '../components/pending-approvals-table/pending-approvals-table';
import { PendingApproval } from '../shared/models/loan-management.model';
import { mockPendingApprovals } from './loan-management.test-helpers';

describe('PendingApprovalsTable Component Integration', () => {
  let component: PendingApprovalsTable;
  let fixture: ComponentFixture<PendingApprovalsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsTable],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalsTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('approvals', []);
    fixture.detectChanges();
  });

  it('should show empty state when no approvals and not loading', () => {
    fixture.componentRef.setInput('approvals', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    expect(component.showEmptyState()).toBe(true);
    expect(component.showList()).toBe(false);
    expect(component.showError()).toBe(false);
  });

  it('should show loading state', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.showList()).toBe(false);
    expect(component.showEmptyState()).toBe(false);
    expect(component.showError()).toBe(false);

    const spinner: HTMLElement | null =
      fixture.nativeElement.querySelector('.pending-approvals__loading');
    expect(spinner).toBeTruthy();
  });

  it('should show error state with reload button', () => {
    fixture.componentRef.setInput('error', 'Something went wrong');
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(component.showError()).toBe(true);
    expect(component.showList()).toBe(false);

    const errorSection: HTMLElement | null =
      fixture.nativeElement.querySelector('.pending-approvals__error');
    expect(errorSection).toBeTruthy();
  });

  it('should show list when approvals exist', () => {
    fixture.componentRef.setInput('approvals', mockPendingApprovals);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    expect(component.showList()).toBe(true);
    expect(component.hasApprovals()).toBe(true);
    expect(component.showEmptyState()).toBe(false);

    const listItems: NodeListOf<Element> =
      fixture.nativeElement.querySelectorAll('.pending-approvals__card');
    expect(listItems.length).toBe(2);
  });

  it('should emit rowClick with approval id on card click', () => {
    fixture.componentRef.setInput('approvals', mockPendingApprovals);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const rowClickSpy = vi.fn();
    component.rowClick.subscribe(rowClickSpy);

    component.onRowClick('loan-1');

    expect(rowClickSpy).toHaveBeenCalledWith('loan-1');
  });

  it('should emit reload event', () => {
    const reloadSpy = vi.fn();
    component.reload.subscribe(reloadSpy);

    component.onReload();

    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  it('should generate correct initials from full name', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Jane Alice Smith')).toBe('JA');
    expect(component.getInitials('Nika')).toBe('N');
    expect(component.getInitials('')).toBe('');
  });

  it('should compute hasApprovals correctly', () => {
    fixture.componentRef.setInput('approvals', []);
    fixture.detectChanges();
    expect(component.hasApprovals()).toBe(false);

    fixture.componentRef.setInput('approvals', mockPendingApprovals);
    fixture.detectChanges();
    expect(component.hasApprovals()).toBe(true);
  });
});
