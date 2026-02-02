import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickActionsSection } from './quick-actions-section';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('QuickActionsSection', () => {
  let component: QuickActionsSection;
  let fixture: ComponentFixture<QuickActionsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsSection, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and emit events', () => {
    const transferOwnSpy = vi.fn();
    const transferExternalSpy = vi.fn();
    const paybillSpy = vi.fn();
    const viewTransactionsSpy = vi.fn();

    component.transferOwnClicked.subscribe(transferOwnSpy);
    component.transferExternalClicked.subscribe(transferExternalSpy);
    component.paybillClicked.subscribe(paybillSpy);
    component.viewTransactionsClicked.subscribe(viewTransactionsSpy);

    component['handleTransferOwn']();
    component['handleTransferExternal']();
    component['handlePaybill']();
    component['handleViewTransactions']();

    expect(transferOwnSpy).toHaveBeenCalled();
    expect(transferExternalSpy).toHaveBeenCalled();
    expect(paybillSpy).toHaveBeenCalled();
    expect(viewTransactionsSpy).toHaveBeenCalled();
  });
});