import { TestBed } from '@angular/core/testing';
import { ModalResponsiveService } from './service-modal';
import { DOCUMENT } from '@angular/common';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as modalConfig from '../config/ui-modal.config';
import { PLATFORM_ID } from '@angular/core';

vi.mock('@angular/common', async () => {
  const actual =
    await vi.importActual<typeof import('@angular/common')>('@angular/common');
  return {
    ...actual,
    isPlatformBrowser: vi.fn().mockReturnValue(true),
  };
});

vi.mock('../config/ui-modal.config', () => ({
  calculateModalPositions: vi.fn(),
  toggleBodyScroll: vi.fn(),
}));

describe('ModalResponsiveService', () => {
  let service: ModalResponsiveService;
  let mockDocument: any;
  let lastObserverCallback: ResizeObserverCallback | null = null;

  beforeEach(() => {
    const mockEl = {
      nodeType: 1,
      style: {},
      offsetParent: { id: 'parent' },
      getBoundingClientRect: vi.fn(() => ({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      })),
    };

    mockDocument = {
      getElementById: vi.fn().mockReturnValue(mockEl),
      createElement: vi.fn().mockReturnValue(mockEl),
      body: {
        contains: vi.fn().mockReturnValue(true),
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        style: {},
      },
      documentElement: { appendChild: vi.fn() },
      implementation: {
        createHTMLDocument: vi.fn().mockReturnValue({ body: {} }),
      },
    };

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: { top: '10px' } as any,
      cardStyle: { top: '70px' } as any,
    });

    const MockResizeObserver = vi.fn().mockImplementation(function (cb) {
      lastObserverCallback = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(123));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    TestBed.configureTestingModule({
      providers: [
        ModalResponsiveService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    service = TestBed.inject(ModalResponsiveService);
  });

  afterEach(() => {
    service.stopTracking();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    lastObserverCallback = null;
  });

  describe('Tracking Logic', () => {
    it('should find element by ID and start tracking', () => {
      service.startTracking('my-id', 8, 16, 'bottom' as any, {});

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(true);
      expect(service.isFallback()).toBe(false);
    });

    it('should handle fallback when element ID does not exist', () => {
      mockDocument.getElementById.mockReturnValue(null);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('non-existent-id', 0, 0, 'top', {});

      expect(service.isFallback()).toBe(true);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

  });
});
