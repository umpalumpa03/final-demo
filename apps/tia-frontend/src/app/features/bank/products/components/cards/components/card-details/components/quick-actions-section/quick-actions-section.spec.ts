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

it('should emit viewTransactionsClicked', () => {
  const spy = vi.fn();
  component.viewTransactionsClicked.subscribe(spy);
  component['handleViewTransactions']();
  expect(spy).toHaveBeenCalled();
});

it('should emit viewSensitiveDetailsClicked', () => {
  const spy = vi.fn();
  component.viewSensitiveDetailsClicked.subscribe(spy);
  component['handleViewSensitiveDetails']();
  expect(spy).toHaveBeenCalled();
});
});
