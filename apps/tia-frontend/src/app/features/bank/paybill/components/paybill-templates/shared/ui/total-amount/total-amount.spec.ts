import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalAmount } from './total-amount';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectTotalAmount } from '../../../../../store/paybill.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TotalAmount', () => {
  let component: TotalAmount;
  let fixture: ComponentFixture<TotalAmount>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalAmount, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTotalAmount, value: 123.45 }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TotalAmount);
    component = fixture.componentInstance;

    store.refreshState();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total amount from the store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('123.45');
  });

  it('should update when the store value changes', () => {
    store.overrideSelector(selectTotalAmount, 999.99);
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('999.99');
  });
});
