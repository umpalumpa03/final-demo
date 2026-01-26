import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import { PaybillState } from '../models/paybill.model';

describe('Paybill Selectors', () => {
  const mockState: PaybillState = {
    categories: [
      {
        id: '1',
        label: 'Phone',
        icon: '',
        providers: [{ id: 'p1', name: 'Carrier X' }],
      },
    ],
    selectedCategoryId: '1',
    selectedProviderId: 'p1',
    loading: false,
    error: null,
  };

  const rootState = { paybill: mockState };

  it('should select the active category object', () => {
    const result = Selectors.selectActiveCategory(rootState);
    expect(result?.id).toBe('1');
    expect(result?.label).toBe('Phone');
  });

  it('should select the active provider object', () => {
    const result = Selectors.selectActiveProvider(rootState);
    expect(result?.id).toBe('p1');
  });

  it('should return null if category ID is not in categories list', () => {
    const badState = { paybill: { ...mockState, selectedCategoryId: '999' } };
    const result = Selectors.selectActiveCategory(badState);
    expect(result).toBeNull();
  });
});
