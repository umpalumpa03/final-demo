import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGridContainer } from './category-grid-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { signal } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { TranslateModule } from '@ngx-translate/core';

describe('CategoryGridContainer', () => {
  let component: CategoryGridContainer;
  let fixture: ComponentFixture<CategoryGridContainer>;
  let store: MockStore;
  let router: Router;

  const mockPaybillMainFacade = {
    searchQuery: signal(''),
    categories: signal([
      { id: 'UTILITIES', name: 'Utilities', providers: [{}, {}] },
      { id: 'INTERNET', name: 'Internet', providers: [{}] },
    ]),
    isLoading: signal(false),
  };

  const mockBreakpointService = {
    isXsMobile: signal(false),
    isTablet: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryGridContainer, TranslateModule.forRoot()],
      providers: [
        { provide: PaybillMainFacade, useValue: mockPaybillMainFacade },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        provideMockStore(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CategoryGridContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('gridColumns responsive logic', () => {
    it('should return 1 column for mobile', () => {
      mockBreakpointService.isXsMobile.set(true);
      fixture.detectChanges();
      expect(component.gridColumns()).toBe('1');
    });

    it('should return 2 columns for tablet', () => {
      mockBreakpointService.isXsMobile.set(false);
      mockBreakpointService.isTablet.set(true);
      fixture.detectChanges();
      expect(component.gridColumns()).toBe('2');
    });

    it('should return 4 columns for desktop', () => {
      mockBreakpointService.isXsMobile.set(false);
      mockBreakpointService.isTablet.set(false);
      fixture.detectChanges();
      expect(component.gridColumns()).toBe('4');
    });
  });

  describe('formattedCategories logic', () => {
    it('should map categories with UI configuration and counts', () => {
      const formatted = component.formattedCategories();

      expect(formatted.length).toBe(2);
      expect(formatted[0].count).toBe(2);
      expect(formatted[0].iconBgColor).toBeDefined();
    });

    it('should filter categories based on search query', () => {
      mockPaybillMainFacade.searchQuery.set('net');

      const formatted = component.formattedCategories();
      expect(formatted.length).toBe(1);
      expect(formatted[0].id).toBe('INTERNET');
    });
  });

  it('should dispatch selectCategory and navigate when a category is selected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const categoryId = 'UTILITIES';

    component.selectCategory(categoryId);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId }),
    );
    expect(router.navigate).toHaveBeenCalledWith(
      [categoryId],
      expect.any(Object),
    );
  });
});
