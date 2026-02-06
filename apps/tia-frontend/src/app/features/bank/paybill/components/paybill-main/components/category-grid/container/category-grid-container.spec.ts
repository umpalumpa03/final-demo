import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGridContainer } from './category-grid-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { signal } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CategoryGridContainer', () => {
  let component: CategoryGridContainer;
  let fixture: ComponentFixture<CategoryGridContainer>;
  let store: MockStore;

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
        provideMockStore(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
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

  it('should dispatch selectCategory action when a category is selected', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const categoryId = 'UTILITIES';

    component.selectCategory(categoryId);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId }),
    );
  });

  it('should display the grid when not loading', () => {
    mockPaybillMainFacade.isLoading.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-category-grid')).toBeTruthy();
  });
});
