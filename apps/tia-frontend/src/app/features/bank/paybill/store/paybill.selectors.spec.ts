import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import {
  PaybillState,
  PaybillCategory,
  PaybillProvider,
} from '../models/paybill.model';

describe('Paybill Selectors', () => {
  const mockProviders: PaybillProvider[] = [
    {
      serviceId: 'prov-1',
      serviceName: 'Water Dept',
      category: 'utilities',
    },
    {
      serviceId: 'prov-2',
      serviceName: 'Electric Co',
      category: 'utilities',
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
        null,
        [],
      );
      expect(result).toBeNull();
    });
  });

  describe('selectActiveProvider', () => {
    it('should return the provider object from the providers array', () => {
      const result = Selectors.selectActiveProvider.projector(
        mockProviders,
        'prov-1',
      );
      expect(result).toEqual(mockProviders[0]);
    });

    it('should return null if there is no providers array', () => {
      const result = Selectors.selectActiveProvider.projector(
        null as any,
        'prov-1',
      );
      expect(result).toBeNull();
    });

    it('should return null if there is no selected provider ID', () => {
      const result = Selectors.selectActiveProvider.projector(
        mockProviders,
        null,
      );
      expect(result).toBeNull();
    });

    it('should return null if the provider ID is not found in the array', () => {
      const result = Selectors.selectActiveProvider.projector(
        mockProviders,
        'non-existent',
      );
      expect(result).toBeNull();
    });
  });
});
