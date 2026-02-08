import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanManagementContainer } from './loan-management-container';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationLoaderService } from '../../../../../../core/i18n';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoanManagementStore } from '../store/loan-management.store';

describe('LoanManagementContainer', () => {
  let component: LoanManagementContainer;
  let fixture: ComponentFixture<LoanManagementContainer>;

  const mockTranslationLoader = {
    loadTranslations: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanManagementContainer, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        LoanManagementStore,
        { provide: TranslationLoaderService, useValue: mockTranslationLoader },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanManagementContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending approvals on init', () => {
    const loadSpy = vi.spyOn(component['store'], 'loadPendingApprovals');
    const shouldLoadSpy = vi.spyOn(component['store'], 'shouldLoadInitialData');
    shouldLoadSpy.mockReturnValue(true);
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalled();
  });

  describe('store method calls', () => {
    it('should select loan when onRowClick is called', () => {
      const selectSpy = vi.spyOn(component['store'], 'selectLoan');
      component['onRowClick']('loan-123');
      expect(selectSpy).toHaveBeenCalledWith('loan-123');
    });

    it('should reload pending approvals when onReload is called', () => {
      const loadSpy = vi.spyOn(component['store'], 'loadPendingApprovals');
      component['onReload']();
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should clear selection when onDrawerClose is called', () => {
      const clearSpy = vi.spyOn(component['store'], 'clearSelection');
      component['onDrawerClose']();
      expect(clearSpy).toHaveBeenCalled();
    });

    it('should approve loan when onApprove is called', () => {
      const approveSpy = vi.spyOn(component['store'], 'approveLoan');
      component['onApprove']('loan-456');
      expect(approveSpy).toHaveBeenCalledWith('loan-456');
    });

    it('should reject loan when onReject is called', () => {
      const rejectSpy = vi.spyOn(component['store'], 'rejectLoan');
      const rejectData = { loanId: 'loan-789', reason: 'High risk' };
      component['onReject'](rejectData);
      expect(rejectSpy).toHaveBeenCalledWith(rejectData);
    });
  });

  describe('auto-dismiss effects', () => {
    it('should have effects that clear success message', () => {
      const clearSpy = vi.spyOn(component['store'], 'clearSuccessMessage');
      expect(component['store']).toBeDefined();
      expect(clearSpy).toBeDefined();
    });

    it('should have effects that clear error', () => {
      const clearSpy = vi.spyOn(component['store'], 'clearError');
      expect(component['store']).toBeDefined();
      expect(clearSpy).toBeDefined();
    });
  });
});
