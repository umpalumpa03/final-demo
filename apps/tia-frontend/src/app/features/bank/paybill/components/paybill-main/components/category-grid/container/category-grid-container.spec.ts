import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGridContainer } from './category-grid-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { signal } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryGridContainer],
      providers: [
        { provide: PaybillMainFacade, useValue: mockPaybillMainFacade },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} },
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

  describe('formattedCategories logic', () => {
    it('should map categories with UI configuration and counts', () => {
      const formatted = component.formattedCategories();

      expect(formatted.length).toBe(2);
      expect(formatted[0].count).toBe(2);
      expect(formatted[0].iconBgColor).toBeDefined();
    });

    it('should filter categories based on search query', () => {
      mockPaybillMainFacade.searchQuery.set('net');
      fixture.detectChanges();

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
    expect(router.navigate).toHaveBeenCalled();
  });
});
