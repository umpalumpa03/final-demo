import { TestOverview } from './test-overview';
import { describe, it, expect } from 'vitest';

describe('TestOverview', () => {
  it('should create an instance', () => {
    const component = new TestOverview();
    expect(component).toBeTruthy();
  });
});
