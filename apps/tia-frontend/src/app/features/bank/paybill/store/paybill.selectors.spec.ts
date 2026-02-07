import { describe, it, expect } from 'vitest';
import * as Selectors from './paybill.selectors';
import { initialPaybillState } from './paybill.state';
import {
  PaybillCategory,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';

describe('Paybill Selectors', () => {
  const mockProviders: PaybillProvider[] = [
    {
      id: 'P1',
      serviceName: 'City Water',
      categoryId: 'UTIL',
      name: 'Water Dept',
    },
  ];

  const mockCategory = {
    id: 'UTIL',
    name: 'Utilities',
    icon: '',
    description: '',
    servicesQuantity: 1,
    providers: [],
  } as PaybillCategory & { providers: PaybillProvider[] };

  const fullState = {
    ...initialPaybillState,
    categories: [mockCategory],
    providers: mockProviders,
    selectedCategoryId: 'UTIL',
    selectedProviderId: 'P1',
    loading: true,
    error: 'Error',
    verifiedDetails: { valid: true } as any,
    paymentPayload: { amount: 100 } as any,
    challengeId: '123-abc',
  };

  describe('Simple Selectors', () => {
    it('should project all simple state slices', () => {
      expect(Selectors.selectLoading.projector(fullState)).toBe(true);
      expect(Selectors.selectCategories.projector(fullState)).toEqual([
        mockCategory,
      ]);
      expect(Selectors.selectProviders.projector(fullState)).toEqual(
        mockProviders,
      );
      expect(Selectors.selectSelectedCategoryId.projector(fullState)).toBe(
        'UTIL',
      );
      expect(Selectors.selectSelectedProviderId.projector(fullState)).toBe(
        'P1',
      );
      expect(Selectors.selectVerifiedDetails.projector(fullState)).toEqual({
        valid: true,
      });

      expect(Selectors.selectPaymentPayload.projector(fullState)).toEqual({
        amount: 100,
      });
      expect(Selectors.selectChallengeId.projector(fullState)).toBe('123-abc');
      expect(Selectors.selectError.projector(fullState)).toBe('Error');
    });
  });

  describe('selectActiveCategory', () => {
    it('should return combined category when found (case-insensitive)', () => {
      const result = Selectors.selectActiveCategory.projector(
        [mockCategory],
        'util',
        mockProviders,
      );
      expect(result).toEqual({ ...mockCategory, providers: mockProviders });
      expect(result?.providers).toHaveLength(1);
    });

    it('should return null if no selected ID', () => {
      const result = Selectors.selectActiveCategory.projector(
        [mockCategory],
        null,
        mockProviders,
      );
      expect(result).toBeNull();
    });
  });

  describe('selectActiveProvider', () => {
    it('should find provider by categoryId fallback', () => {
      const fallbackProv = {
        categoryId: 'FALLBACK',
        name: 'F',
        id: 'fallback',
      } as PaybillProvider;

      const state = { ...fullState, selectedProviderId: 'fallback' };
      const result = Selectors.selectActiveProvider.projector(state, [
        fallbackProv,
      ]);
      expect(result).toEqual(fallbackProv);
    });

    it('should return selectedProvider directly from state if set', () => {
      const manualProv = { id: 'manual', name: 'Manual' } as any;
      const state = { ...fullState, selectedProvider: manualProv };
      const result = Selectors.selectActiveProvider.projector(state, []);
      expect(result).toEqual(manualProv);
    });
  });

  describe('selectTemplatesAsTreeItems', () => {
    it('should transform templates to tree items', () => {
      const templates = [
        {
          id: 't1',
          nickname: 'My Template',
          serviceId: 'SVC1',

          groupId: '4b03d846-43af-45cd-8d69-04b71d784625',
          identification: { accountNumber: '123' },
        },
        {
          id: 't2',
          nickname: 'Another',
          serviceId: 'SVC2',
          identification: { accountNumber: '456' },
        },
      ] as any;

      const result = Selectors.selectTemplatesAsTreeItems.projector(templates);

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: 't1',
        title: 'My Template',
        subtitle: 'SVC1',
        groupId: '4b03d846-43af-45cd-8d69-04b71d784625',
        icon: 'images/svg/paybill/favorite.svg',
        accountNumber: '123',
        order: 0,
      });
      expect(result[1].order).toBe(1);
    });

    it('should return empty array when templates is empty', () => {
      const result = Selectors.selectTemplatesAsTreeItems.projector([]);
      expect(result).toEqual([]);
    });
  });

  describe('selectTemplates', () => {
    it('should return templates from state', () => {
      const templates = [{ id: 't1', nickname: 'Template 1' }] as any;
      const state = { ...initialPaybillState, templates };
      const result = Selectors.selectTemplates.projector(state);
      expect(result).toEqual(templates);
    });

    it('should return empty array when no templates', () => {
      const result = Selectors.selectTemplates.projector(initialPaybillState);
      expect(result).toEqual([]);
    });
  });

  describe('selectTemplatesGroupWithConfigs', () => {
    it('should expand groups with items', () => {
      const groups = [
        { id: 'g1', templateCount: 5 },
        { id: 'g2', templateCount: 0 },
      ] as any;

      const result =
        Selectors.selectTemplatesGroupWithConfigs.projector(groups);

      expect(result[0].expanded).toBe(true);
      expect(result[0].icon).toContain('group.svg');

      expect(result[1].expanded).toBe(false);
    });
  });

  describe('selectProvidersDropdown', () => {
    it('should filter providers with parentId null and map to dropdown items', () => {
      const activeCategory = {
        providers: [
          { id: '1', name: 'Parent', parentId: null },
          { id: '2', name: 'Child', parentId: '1' },
          { id: '3', name: 'Another Parent', parentId: null },
        ],
      } as any;

      const result =
        Selectors.selectProvidersDropdown.projector(activeCategory);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ label: 'Parent', value: '1' });
      expect(result).not.toContainEqual({ label: 'Child', value: '2' });
    });

    it('should return empty array if activeCategory is null', () => {
      expect(Selectors.selectProvidersDropdown.projector(null)).toEqual([]);
    });
  });

  describe('selectFilteredProviders', () => {
    it('should map nested filtered providers correctly', () => {
      const state = {
        filteredProviders: [
          [
            { id: 'p1', name: 'Prov 1', isFinal: true },
            { id: 'p2', name: 'Prov 2', isFinal: false },
          ],
        ],
      } as any;

      const result = Selectors.selectFilteredProviders.projector(state);

      expect(result[0][0]).toEqual({
        label: 'Prov 1',
        value: 'p1',
        isFinal: true,
      });
      expect(result[0]).toHaveLength(2);
    });

    it('should return empty array if filteredProviders is missing or empty', () => {
      expect(
        Selectors.selectFilteredProviders.projector({
          filteredProviders: [],
        } as any),
      ).toEqual([]);
      expect(Selectors.selectFilteredProviders.projector({} as any)).toEqual(
        [],
      );
    });
  });

  describe('Loaded State Selectors', () => {
    it('should return false if collections are empty', () => {
      expect(Selectors.selectCategoriesLoaded.projector([])).toBe(false);
      expect(Selectors.selectTemplatesLoaded.projector([])).toBe(false);
      expect(Selectors.selectTemplateGroupsLoaded.projector([])).toBe(false);
    });
  });

  describe('selectPaymentDetails Selectors', () => {
    it('should select payment fields and serviceId', () => {
      const stateWithDetails = {
        ...initialPaybillState,
        paymentDetails: {
          serviceId: 'SERV-123',
          fields: [{ name: 'account', type: 'text' }],
        },
      } as any;

      expect(
        Selectors.selectPaymentFields.projector(stateWithDetails),
      ).toHaveLength(1);
      expect(Selectors.selectServiceId.projector(stateWithDetails)).toBe(
        'SERV-123',
      );
    });

    it('should return empty array for fields if paymentDetails is null', () => {
      expect(Selectors.selectPaymentFields.projector({} as any)).toEqual([]);
    });
  });

  describe('selectNotifications', () => {
    it('should return notifications from state', () => {
      const notifications = [{ id: 1, message: 'Test' }] as any;
      const state = { ...initialPaybillState, notifications };
      expect(Selectors.selectNotifications.projector(state)).toEqual(
        notifications,
      );
    });
  });
});
