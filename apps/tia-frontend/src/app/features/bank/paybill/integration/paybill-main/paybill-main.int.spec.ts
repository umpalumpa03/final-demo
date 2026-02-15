import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signal } from '@angular/core';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';

import { PaybillMain } from '../../components/paybill-main/container/paybill-main';
import { PaybillMainFacade } from '../../components/paybill-main/services/paybill-main-facade';

describe('Integration: Paybill Main Container', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let mockFacade: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    mockFacade = {
      init: vi.fn(),
      setSearchQuery: vi.fn(),
      clearRepeatTransaction: vi.fn(),
      isRootProviderView: signal(true),
      showSearch: signal(true),

      activeCategory: signal({ id: 'cat-1', name: 'Utilities' }),
      selectedParentId: signal<string | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [
        PaybillMain,
        ReactiveFormsModule,

        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create the component and initialize facade', () => {
    expect(component).toBeTruthy();
    expect(mockFacade.init).toHaveBeenCalled();
  });

  it('should update search query in facade when user types (with debounce)', () => {
    const searchString = 'Magti';

    component.searchControl.setValue(searchString);

    vi.advanceTimersByTime(300);

    expect(mockFacade.setSearchQuery).toHaveBeenCalledWith(searchString);
  });

  it('should handle visibility of navigation components based on facade state', () => {
    mockFacade.isRootProviderView.set(true);
    fixture.detectChanges();
    let backNav = fixture.nativeElement.querySelector('app-back-navigation');
    expect(backNav).toBeNull();

    mockFacade.isRootProviderView.set(false);
    fixture.detectChanges();
    backNav = fixture.nativeElement.querySelector('app-back-navigation');
    expect(backNav).not.toBeNull();
  });

  it('should clear repeat transaction state on destruction', () => {
    fixture.destroy();
    expect(mockFacade.clearRepeatTransaction).toHaveBeenCalled();
  });
});
