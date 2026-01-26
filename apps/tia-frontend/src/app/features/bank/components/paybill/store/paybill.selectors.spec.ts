import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import { PaybillState, PaybillCategory } from '../models/paybill.model';

describe('Paybill Selectors', () => {
  const TEST_CAT_ID = 'category-123';
  const TEST_PROV_ID = 'provider-456';

  const createMockCategory = (id: string): PaybillCategory => ({
    id,
    label: 'Utilities',
    icon: 'utility-icon',
    providers: [{ id: TEST_PROV_ID, name: 'Water Company' }],
  });

  const createInitialState = (
    overrides: Partial<PaybillState> = {},
  ): { paybill: PaybillState } => ({
    paybill: {
      categories: [createMockCategory(TEST_CAT_ID)],
      selectedCategoryId: TEST_CAT_ID,
      selectedProviderId: TEST_PROV_ID,
      loading: false,
      error: null,
      ...overrides,
    },
  });

  describe('Feature and Basic Selectors', () => {
    it('should select the categories array', () => {
      const state = createInitialState();
      const result = Selectors.selectCategories(state);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(TEST_CAT_ID);
    });

    it('should select the raw selected category ID', () => {
      const state = createInitialState({ selectedCategoryId: 'custom-id' });
      expect(Selectors.selectSelectedCategoryId(state)).toBe('custom-id');
    });
  });

  describe('selectActiveCategory', () => {
    it('should return the category object when ID exists in categories list', () => {
      const state = createInitialState();
      const result = Selectors.selectActiveCategory(state);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(TEST_CAT_ID);
      expect(result?.label).toBe('Utilities');
    });

    it('should return null when selectedCategoryId is null', () => {
      const state = createInitialState({ selectedCategoryId: null });
      const result = Selectors.selectActiveCategory(state);
      expect(result).toBeNull();
    });

    it('should return null when the ID is not found in the categories array', () => {
      const state = createInitialState({ selectedCategoryId: 'non-existent' });
      const result = Selectors.selectActiveCategory(state);
      expect(result).toBeNull();
    });
  });

  describe('selectActiveProvider', () => {
    it('should return the provider object when both category and provider are valid', () => {
      const state = createInitialState();
      const result = Selectors.selectActiveProvider(state);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(TEST_PROV_ID);
      expect(result?.name).toBe('Water Company');
    });

    it('should return null if no active category is found', () => {
      const state = createInitialState({ selectedCategoryId: 'wrong-cat' });
      const result = Selectors.selectActiveProvider(state);
      expect(result).toBeNull();
    });

    it('should return null if selectedProviderId is null', () => {
      const state = createInitialState({ selectedProviderId: null });
      const result = Selectors.selectActiveProvider(state);
      expect(result).toBeNull();
    });

    it('should return null if the provider ID is not found within the active category', () => {
      const state = createInitialState({
        selectedProviderId: 'unknown-provider',
      });
      const result = Selectors.selectActiveProvider(state);
      expect(result).toBeNull();
    });
  });
});
