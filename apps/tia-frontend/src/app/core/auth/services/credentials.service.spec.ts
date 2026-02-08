import { CredentialsService } from './credentials.service';
import { vi } from 'vitest';

describe('CredentialsService', () => {
  let service: CredentialsService;

  beforeEach(() => {
    service = new CredentialsService();
    localStorage.removeItem('credentials');
  });

  afterEach(() => {
    localStorage.removeItem('credentials');
    vi.restoreAllMocks();
  });

  it('returns empty object when no credentials stored', () => {
    expect(service.getCredentials()).toEqual({});
    expect(service.initialUsername()).toBe('');
    expect(service.initialCheckboxValue()).toBe(false);
  });

  it('parses stored credentials', () => {
    const payload = { username: 'alice', save: true };
    localStorage.setItem('credentials', JSON.stringify(payload));

    expect(service.getCredentials()).toEqual(payload);
    expect(service.initialUsername()).toBe('alice');
    expect(service.initialCheckboxValue()).toBe(true);
  });

  it('throws when stored credentials are invalid JSON', () => {
    localStorage.setItem('credentials', 'not-json');

    expect(() => service.getCredentials()).toThrow();
    expect(() => service.initialUsername()).toThrow();
    expect(() => service.initialCheckboxValue()).toThrow();
  });

  it('saveCredentials stores JSON and clear removes it', () => {
    const payload = { username: 'bob', save: false };
    service.saveCredentials(payload);

    expect(localStorage.getItem('credentials')).toBe(JSON.stringify(payload));

    service.clear();
    expect(localStorage.getItem('credentials')).toBeNull();
  });

  it('saveCredentials(null) clears the storage', () => {
    localStorage.setItem('credentials', JSON.stringify({ username: 'x' }));
    service.saveCredentials(null);
    expect(localStorage.getItem('credentials')).toBeNull();
  });
});
