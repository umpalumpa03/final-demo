import { ExpirationTimer } from './expiration-timer';

describe('ExpirationTimer', () => {
  it('should create an instance', () => {
    const directive = new ExpirationTimer();
    expect(directive).toBeTruthy();
  });
});
