import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import { PaybillState, PaybillCategory } from '../models/paybill.model';

describe('Paybill Selectors', () => {
  const mockCategories: PaybillCategory[] = [
    {
      id: 'cat-1',
      label: 'Utilities',
      icon: 'water',
      providers: [
        { id: 'prov-1', name: 'Water Dept' },
        { id: 'prov-2', name: 'Electric Co' },
      ],
    },
    {
      id: 'cat-2',
      label: 'Internet',
      icon: 'wifi',
      providers: [],
    },
  ];

  const initialState: PaybillState = {
    categories: mockCategories,
    selectedCategoryId: 'cat-1',
    selectedProviderId: 'prov-1',
    loading: false,
    error: null,
  };

  describe('Basic State Selectors', () => {
    it('should select categories', () => {
      const result = Selectors.selectCategories.projector(initialState);
      expect(result).toEqual(mockCategories);
    });

    it('should select selectedCategoryId', () => {
      const result = Selectors.selectSelectedCategoryId.projector(initialState);
      expect(result).toBe('cat-1');
    });

    it('should select selectedProviderId', () => {
      const result = Selectors.selectSelectedProviderId.projector(initialState);
      expect(result).toBe('prov-1');
    });
  });

  describe('selectActiveCategory', () => {
    it('should return the category object matching the selected ID', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        'cat-1',
      );
      expect(result?.id).toBe('cat-1');
      expect(result?.label).toBe('Utilities');
    });

    it('should return null if the category ID is not found', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        'non-existent',
      );
      expect(result).toBeNull();
    });

    it('should return null if selectedId is null', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        null,
      );
      expect(result).toBeNull();
    });
  });

  describe('selectActiveProvider', () => {
    it('should return the provider object within the active category', () => {
      const activeCategory = mockCategories[0];
      const result = Selectors.selectActiveProvider.projector(
        activeCategory,
        'prov-1',
      );
      expect(result).toEqual({ id: 'prov-1', name: 'Water Dept' });
    });

    it('should return null if there is no active category', () => {
      const result = Selectors.selectActiveProvider.projector(null, 'prov-1');
      expect(result).toBeNull();
    });

    it('should return null if there is no selected provider ID', () => {
      const activeCategory = mockCategories[0];
      const result = Selectors.selectActiveProvider.projector(
        activeCategory,
        null,
      );
      expect(result).toBeNull();
    });

    it('should return null if the provider ID is not found in the category', () => {
      const activeCategory = mockCategories[0];
      const result = Selectors.selectActiveProvider.projector(
        activeCategory,
        'unknown-prov',
      );
      expect(result).toBeNull();
    });
  });
});
