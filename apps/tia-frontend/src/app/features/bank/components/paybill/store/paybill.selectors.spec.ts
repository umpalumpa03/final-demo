import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import { PaybillState } from '../models/paybill.model';

describe('Paybill Selectors', () => {
  const CAT_ID = 'category-123';
  const PROV_ID = 'provider-456';

  const mockState: PaybillState = {
    categories: [
      {
        id: CAT_ID,
        label: 'Utilities',
        icon: 'utility-icon',
        providers: [{ id: PROV_ID, name: 'Water Company' }],
      },
    ],
    selectedCategoryId: CAT_ID,
    selectedProviderId: PROV_ID,
    loading: false,
    error: null,
  };

  const rootState = { paybill: mockState };

  it('should select the categories list', () => {
    const result = Selectors.selectCategories(rootState);
    expect(result).toEqual(mockState.categories);
    expect(result.length).toBe(1);
  });

  it('should select the active category object based on ID', () => {
    const result = Selectors.selectActiveCategory(rootState);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(CAT_ID);
    expect(result?.label).toBe('Utilities');
  });

  it('should select the active provider object from within the category', () => {
    const result = Selectors.selectActiveProvider(rootState);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(PROV_ID);
    expect(result?.name).toBe('Water Company');
  });

  describe('Edge Cases & Null Safety', () => {
    it('should return null if selectActiveCategory finds no match', () => {
      const stateWithNoMatch = {
        paybill: { ...mockState, selectedCategoryId: 'non-existent-id' },
      };
      const result = Selectors.selectActiveCategory(stateWithNoMatch);
      expect(result).toBeNull();
    });

    it('should return null if selectedCategoryId is null', () => {
      const stateWithNull = {
        paybill: { ...mockState, selectedCategoryId: null },
      };
      const result = Selectors.selectActiveCategory(stateWithNull);
      expect(result).toBeNull();
    });

    it('should return null for provider if category is not found', () => {
      const stateWithNoCat = {
        paybill: { ...mockState, selectedCategoryId: 'missing' },
      };
      const result = Selectors.selectActiveProvider(stateWithNoCat);
      expect(result).toBeNull();
    });

    it('should return null if selectedProviderId is null', () => {
      const stateWithNoProvId = {
        paybill: { ...mockState, selectedProviderId: null },
      };
      const result = Selectors.selectActiveProvider(stateWithNoProvId);
      expect(result).toBeNull();
    });

    it('should return null if provider ID does not exist in the current category', () => {
      const stateWithWrongProv = {
        paybill: { ...mockState, selectedProviderId: 'wrong-provider-id' },
      };
      const result = Selectors.selectActiveProvider(stateWithWrongProv);
      expect(result).toBeNull();
    });
  });
});
