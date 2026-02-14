import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal, EventEmitter } from '@angular/core';
import { PaybillActions } from '../../store/paybill.actions';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { CategoryGridContainer } from '../../components/paybill-main/components/category-grid/container/category-grid-container';
import { PaybillMainFacade } from '../../components/paybill-main/services/paybill-main-facade';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';

describe('Integration: Category Grid Container', () => {
  let component: CategoryGridContainer;
  let fixture: ComponentFixture<CategoryGridContainer>;
  let router: Router;
  let store: any;
  let mockFacade: any;
  let mockBreakpointService: any;

  beforeEach(async () => {
    mockFacade = {
      searchQuery: signal(''),
      categories: signal([
        { id: 'utility', name: 'Utilities', providers: [] },
        { id: 'internet', name: 'Internet', providers: [] },
      ]),
      isLoading: signal(false),
    };

    mockBreakpointService = {
      isXsMobile: signal(false),
      isTablet: signal(false),
    };

    const mockStore = { dispatch: vi.fn() };
    const mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [
        CategoryGridContainer,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { relativeTo: 'mock-route' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryGridContainer);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should filter categories based on facade search query', () => {
    mockFacade.searchQuery.set('Util');
    fixture.detectChanges();

    const filtered = component.formattedCategories();

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Utilities');
  });

  it('should adapt grid columns based on breakpoints', () => {
    mockBreakpointService.isXsMobile.set(false);
    mockBreakpointService.isTablet.set(false);
    fixture.detectChanges();
    expect(component.gridColumns()).toBe('4');

    mockBreakpointService.isXsMobile.set(true);
    fixture.detectChanges();
    expect(component.gridColumns()).toBe('1');
  });

  it('should dispatch action and navigate when a category is selected', () => {
    const categoryId = 'utility';

    component.selectCategory(categoryId);

    expect(store.dispatch).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId }),
    );

    expect(router.navigate).toHaveBeenCalledWith([categoryId], {
      relativeTo: expect.anything(),
    });
  });
});
