import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import {
  PaybillState,
  PaybillCategory,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';

describe('Paybill Selectors', () => {
  const mockProviders: PaybillProvider[] = [
    {
      serviceName: 'Test',
      id: 'prov-1',
      name: 'Water Dept',
      categoryId: 'utilities',
    },
    {
      serviceName: 'Test',
      id: 'prov-2',
      name: 'Electric Co',
      categoryId: 'utilities',
    },
  ];

  const mockCategories: PaybillCategory[] = [
    {
      id: 'cat-1',
      name: 'Utilities',
      icon: 'water',
      description: 'Utilities description',
      servicesQuantity: 2,
      providers: [],
    },
    {
      id: 'cat-2',
      name: 'Internet',
      icon: 'wifi',
      description: 'Internet description',
      servicesQuantity: 0,
      providers: [],
    },
  ];

  const initialState: PaybillState = {
    categories: mockCategories,
    selectedCategoryId: 'cat-1',
    selectedProviderId: 'prov-1',
    selectedProvider: null,
    verifiedDetails: null,
    loading: false,
    error: null,
    providers: mockProviders,
  };

  describe('selectActiveCategory', () => {
    it('should return the category object matching the selected ID', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        'cat-1',
        mockProviders,
      );
      expect(result?.id).toBe('cat-1');
      expect(result?.providers).toEqual(mockProviders);
    });

    it('should return null if category ID is not found', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        'non-existent',
        [],
      );
      expect(result).toBeNull();
    });

    it('should return null if selectedId is null', () => {
      const result = Selectors.selectActiveCategory.projector(
        mockCategories,
        null as any,
        [],
      );
      expect(result).toBeNull();
    });
  });

  describe('selectActiveProvider', () => {
    it('should return the provider object from the providers array', () => {
      const mockState = {
        ...initialState,
        selectedProviderId: 'prov-1',
      };

      const result = Selectors.selectActiveProvider.projector(
        mockState,
        mockProviders,
      );

      expect(result?.id).toBe('prov-1');
    });

    it('should return null if there is no providers array', () => {
      const mockState = { ...initialState, selectedProviderId: 'prov-1' };

      const result = Selectors.selectActiveProvider.projector(
        mockState,
        null as any,
      );
      expect(result).toBeNull();
    });

    it('should return null if the state is missing', () => {
      const result = Selectors.selectActiveProvider.projector(
        null as any,
        mockProviders,
      );
      expect(result).toBeNull();
    });
  });
});
