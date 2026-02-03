import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillMain } from './paybill-main';
import { PaybillMainFacade } from '../services/paybill-main-facade';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let facadeMock: Partial<PaybillMainFacade>;

  beforeEach(async () => {
    // Enable fake timers for Vitest
    vi.useFakeTimers();

    facadeMock = {
      init: vi.fn(),
      setSearchQuery: vi.fn(),
      activeProvider: signal(null),
      isLoading: signal(false),
    } as unknown as Partial<PaybillMainFacade>;

    await TestBed.configureTestingModule({
      imports: [PaybillMain, TranslateModule.forRoot()],
      providers: [{ provide: PaybillMainFacade, useValue: facadeMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade.init on ngOnInit', () => {
    expect(facadeMock.init).toHaveBeenCalled();
  });

  it('should call setSearchQuery after debounce time', () => {
    const query = 'Internet';

    // Change value
    component.searchControl.setValue(query);

    // Fast-forward 300ms
    vi.advanceTimersByTime(300);

    expect(facadeMock.setSearchQuery).toHaveBeenCalledWith(query);
  });

  it('should only call setSearchQuery once for multiple rapid changes', () => {
    component.searchControl.setValue('A');
    component.searchControl.setValue('AB');
    component.searchControl.setValue('ABC');

    // Advance time
    vi.advanceTimersByTime(300);

    // Should only be called with the latest value
    expect(facadeMock.setSearchQuery).toHaveBeenCalledTimes(1);
    expect(facadeMock.setSearchQuery).toHaveBeenCalledWith('ABC');
  });
});
