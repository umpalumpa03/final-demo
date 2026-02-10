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

  it('ngOnInit should load pending approvals when initial data is needed', () => {
    const loadSpy = vi.spyOn(component['store'], 'loadPendingApprovals');
    const shouldLoadSpy = vi.spyOn(component['store'], 'shouldLoadInitialData');
    shouldLoadSpy.mockReturnValue(true);
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('onRowClick should call store.selectLoan with given ID', () => {
    const spy = vi.spyOn(component['store'], 'selectLoan');
    component['onRowClick']('loan-123');
    expect(spy).toHaveBeenCalledWith('loan-123');
  });

  it('onReload should call store.loadPendingApprovals', () => {
    const spy = vi.spyOn(component['store'], 'loadPendingApprovals');
    component['onReload']();
    expect(spy).toHaveBeenCalled();
  });

  it('onDrawerClose should call store.clearSelection', () => {
    const spy = vi.spyOn(component['store'], 'clearSelection');
    component['onDrawerClose']();
    expect(spy).toHaveBeenCalled();
  });

  it('onApprove should call store.approveLoan with given ID', () => {
    const spy = vi.spyOn(component['store'], 'approveLoan');
    component['onApprove']('loan-456');
    expect(spy).toHaveBeenCalledWith('loan-456');
  });

  it('onReject should call store.rejectLoan with given data', () => {
    const spy = vi.spyOn(component['store'], 'rejectLoan');
    const rejectData = { loanId: 'loan-789', reason: 'High risk' };
    component['onReject'](rejectData);
    expect(spy).toHaveBeenCalledWith(rejectData);
  });
});
