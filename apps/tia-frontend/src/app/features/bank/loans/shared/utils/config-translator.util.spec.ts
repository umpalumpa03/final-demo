import { describe, it, expect } from 'vitest';
import { translateConfig } from './config-translator.util';

describe('translateConfig', () => {
  const mockTranslateFn = (key: string) => `TRANSLATED_${key}`;

  const TEST_CONFIG = {
    amount: {
      label: 'loans.amount_label',
      placeholder: 'loans.amount_placeholder',
      type: 'number',
      required: true,
      prefixIcon: './icon.svg',
    },
    options: {
      errorMessage: 'loans.error_msg',
      description: 'loans.desc',
      layout: 'column',
    },
    simple: {
      type: 'text',
    },
  } as const;

  it('should translate standard keys (label, placeholder, errorMessage, description)', () => {
    const result = translateConfig(TEST_CONFIG, mockTranslateFn);

    expect(result.amount.label).toBe('TRANSLATED_loans.amount_label');
    expect(result.amount.placeholder).toBe(
      'TRANSLATED_loans.amount_placeholder',
    );
    expect(result.options.errorMessage).toBe('TRANSLATED_loans.error_msg');
    expect(result.options.description).toBe('TRANSLATED_loans.desc');
  });

  it('should preserve specific keys (type, layout, prefixIcon, required)', () => {
    const result = translateConfig(TEST_CONFIG, mockTranslateFn);

    expect(result.amount.type).toBe('number');
    expect(result.options.layout).toBe('column');

    expect(result.amount.prefixIcon).toBe('./icon.svg');
    expect(result.amount.required).toBe(true);
  });

  it('should create a new object instance (Immutability)', () => {
    const result = translateConfig(TEST_CONFIG, mockTranslateFn);
    expect(result).not.toBe(TEST_CONFIG);
    expect(result.amount).not.toBe(TEST_CONFIG.amount);

    expect(TEST_CONFIG.amount.label).toBe('loans.amount_label');
  });

  it('should handle fields that do not have translatable properties gracefully', () => {
    const result = translateConfig(TEST_CONFIG, mockTranslateFn);

    expect(result.simple.type).toBe('text');
    expect((result.simple as any).label).toBeUndefined();
  });
});
