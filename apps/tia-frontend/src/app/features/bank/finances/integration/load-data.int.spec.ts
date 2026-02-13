import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  setupFinancesTest,
  cleanupFinancesTest,
  FinancesTestContext,
  mockSummary,
  mockCategories,
} from './finances.test-helpers';

describe('Finances Integration - Data Loading', () => {
  let ctx: FinancesTestContext;

  beforeEach(async () => {
    ctx = await setupFinancesTest();
  });

  afterEach(() => {
    cleanupFinancesTest(ctx.httpMock);
  });

  it('should load financial summary', () => {
    const from = '2026-02-01';
    let receivedData: any;

    ctx.service.getSummary(from).subscribe((data) => {
      receivedData = data;
    });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/finances/summary?value=${from}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSummary);
    expect(receivedData.totalIncome).toBe(5000);
  });

  it('should load category breakdown', () => {
    const from = '2026-02-01';
    let receivedData: any;

    ctx.service.getCategories(from).subscribe((data) => {
      receivedData = data;
    });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/finances/category-breakdown?value=${from}`,
    );
    req.flush(mockCategories);
    expect(receivedData.length).toBe(3);
  });
});
