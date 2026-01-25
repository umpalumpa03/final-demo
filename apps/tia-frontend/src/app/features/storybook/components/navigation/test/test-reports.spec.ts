import { TestReports } from './test-reports';
import { describe, it, expect } from 'vitest';

describe('TestReports', () => {
  it('should create an instance', () => {
    const component = new TestReports();
    expect(component).toBeTruthy();
  });
});
