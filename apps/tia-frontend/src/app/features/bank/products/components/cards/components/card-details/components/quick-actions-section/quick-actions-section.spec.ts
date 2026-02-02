import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickActionsSection } from './quick-actions-section';

describe('QuickActionsSection', () => {
  let component: QuickActionsSection;
  let fixture: ComponentFixture<QuickActionsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionsSection);
    component = fixture.componentInstance;
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

    component.transferOwnClicked.emit();
    component.transferExternalClicked.emit();
    component.paybillClicked.emit();
    component.viewTransactionsClicked.emit();

    expect(transferOwnSpy).toHaveBeenCalled();
    expect(transferExternalSpy).toHaveBeenCalled();
    expect(paybillSpy).toHaveBeenCalled();
    expect(viewTransactionsSpy).toHaveBeenCalled();
  });
});