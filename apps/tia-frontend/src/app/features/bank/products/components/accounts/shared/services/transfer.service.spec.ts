import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferService } from './transfer.service';
import { PERMISSION_ROUTE_MAP } from '../config/accounts.config';

describe('TransferService', () => {
  let service: TransferService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TransferService] });
    service = TestBed.inject(TransferService);
    router = TestBed.inject(Router);
  });

  it('should navigate using PERMISSION_ROUTE_MAP for valid permissions', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    Object.entries(PERMISSION_ROUTE_MAP).forEach(([permission, route]) => {
      navigateSpy.mockClear();
      const result = service.navigateToTransferPage(
        'acc-123',
        Number(permission),
      );
      expect(result).toBe(true);
      expect(navigateSpy).toHaveBeenCalledWith([route], {
        queryParams: { accountId: 'acc-123' },
      });
    });
  });

  it('should return false for invalid permission', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const result = service.navigateToTransferPage('acc-999', 999);
    expect(result).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
