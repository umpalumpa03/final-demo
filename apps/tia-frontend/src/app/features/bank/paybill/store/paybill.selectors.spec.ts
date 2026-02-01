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
    currentStep: 'OTP',
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
      expect(Selectors.selectCurrentStep.projector(fullState)).toBe('OTP');

      if ((Selectors as any).selectPaymentPayload) {
        expect(
          (Selectors as any).selectPaymentPayload.projector(fullState),
        ).toEqual({ amount: 100 });
      }
      if ((Selectors as any).selectChallengeId) {
        expect((Selectors as any).selectChallengeId.projector(fullState)).toBe(
          '123-abc',
        );
      }
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
  });

  describe('selectActiveProvider', () => {
    it('should find provider by categoryId fallback', () => {
      const fallbackProv = {
        categoryId: 'FALLBACK',
        name: 'F',
      } as PaybillProvider;
      const state = { ...fullState, selectedProviderId: 'fallback' };
      const result = Selectors.selectActiveProvider.projector(state, [
        fallbackProv,
      ]);
      expect(result).toEqual(fallbackProv);
    });
  });

  describe('selectPaybillBreadcrumbs', () => {
    it('should return base path if nothing selected', () => {
      const result = Selectors.selectPaybillBreadcrumbs.projector(
        null,
        null,
        null,
      );
      expect(result).toEqual([
        { label: 'Paybill', route: '/bank/paybill/pay' },
      ]);
    });

    it('should return Templates breadcrumb', () => {
      const result = Selectors.selectPaybillBreadcrumbs.projector(
        null,
        null,
        'TEMPLATES',
      );
      expect(result[1]).toEqual({ label: 'Templates', route: '' });
    });
  });
});
