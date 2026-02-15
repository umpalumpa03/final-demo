import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillMain } from './paybill-main';
import { PaybillMainFacade } from '../services/paybill-main-facade';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let facadeMock: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    facadeMock = {
      init: vi.fn(),
      setSearchQuery: vi.fn(),
      clearRepeatTransaction: vi.fn(),

      activeProvider: signal(null),
      isLoading: signal(false),
      showSearch: signal(true),
      activeCategory: signal(null),
      selectedParentId: signal(null),
      isRootProviderView: signal(false),
      resetPaymentForm: vi.fn(),
      isCategoriesPage: signal(false),
      isProviderListVisible: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        PaybillMain,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        provideMockStore({}),
        { provide: PaybillMainFacade, useValue: facadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create and initialize', () => {
    expect(component).toBeTruthy();
    expect(facadeMock.init).toHaveBeenCalled();
  });

  it('should debounce search input changes', () => {
    component.searchControl.setValue('TBC Bank');

    expect(facadeMock.setSearchQuery).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(facadeMock.setSearchQuery).toHaveBeenCalledWith('TBC Bank');
  });

  it('should cleanup on destroy', () => {
    component.ngOnDestroy();
    expect(facadeMock.clearRepeatTransaction).toHaveBeenCalled();
  });
});
