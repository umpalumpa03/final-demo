import { describe, it, expect } from 'vitest';
import { paybillReducer, initialPaybillState } from './paybill.reducer';
import { PaybillActions } from './paybill.actions';

describe('Paybill Reducer', () => {
  it('should set loading to true and clear error on loadCategories', () => {
    const action = PaybillActions.loadCategories();
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should update categories and stop loading on loadCategoriesSuccess', () => {
    const categories = [
      {
        id: '1',
        name: 'Utilities',
        icon: '',
        description: '',
        servicesQuantity: 1,
        providers: [],
      },
    ];
    const action = PaybillActions.loadCategoriesSuccess({ categories });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.categories).toEqual(categories);
    expect(result.loading).toBe(false);
  });

  it('should set selectedCategoryId, clear provider, and set loading on selectCategory', () => {
    const action = PaybillActions.selectCategory({ categoryId: 'cat_123' });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.selectedCategoryId).toBe('cat_123');
    expect(result.selectedProviderId).toBeNull();
    expect(result.loading).toBe(true);
    expect(result.providers).toEqual([]);
  });

  it('should update selectedProviderId on selectProvider', () => {
    const action = PaybillActions.selectProvider({ providerId: 'prov_123' });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.selectedProviderId).toBe('prov_123');
  });

  it('should update providers and stop loading on loadProvidersSuccess', () => {
    const providers = [
      { id: 'p1', serviceName: 'Provider 1', categoryId: 'cat_1' },
    ];
    const action = PaybillActions.loadProvidersSuccess({ providers });

    const stateWithLoading = { ...initialPaybillState, loading: true };
    const result = paybillReducer(stateWithLoading, action);

    expect(result.providers).toEqual(providers);
    expect(result.loading).toBe(false);
  });

  it('should reset selections on clearSelection', () => {
    const modifiedState = {
      ...initialPaybillState,
      selectedCategoryId: '1',
      selectedProviderId: '2',
    };
    const action = PaybillActions.clearSelection();
    const result = paybillReducer(modifiedState, action);

    expect(result.selectedCategoryId).toBeNull();
    expect(result.selectedProviderId).toBeNull();
  });
});
