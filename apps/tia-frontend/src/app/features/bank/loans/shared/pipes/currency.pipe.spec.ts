import { CurrencySymbolPipe } from './currency.pipe';

describe('CurrencySymbolPipe', () => {
  let pipe: CurrencySymbolPipe;

  beforeEach(() => {
    pipe = new CurrencySymbolPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return ₾ for GEL', () => {
    expect(pipe.transform('GEL')).toBe('₾');
  });

  it('should return $ for USD', () => {
    expect(pipe.transform('USD')).toBe('$');
  });

  it('should return € for EUR', () => {
    expect(pipe.transform('EUR')).toBe('€');
  });

  it('should return £ for GBP', () => {
    expect(pipe.transform('GBP')).toBe('£');
  });

  it('should return an empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });
});
