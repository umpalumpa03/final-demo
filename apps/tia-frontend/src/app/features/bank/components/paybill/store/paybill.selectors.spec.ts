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

    it('should select the loading state', () => {
      const state = createInitialState({ loading: true });
      expect(Selectors.selectPaybillState(state).loading).toBe(true);
    });
  });

  describe('selectActiveProvider Edge Cases', () => {
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
