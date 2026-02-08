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
      documentElement: {
        appendChild: vi.fn(),
      },
      implementation: {
        createHTMLDocument: vi.fn().mockReturnValue({ body: {} }),
      },
    };

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: {
        top: '10px',
        left: '20px',
        width: '100px',
        height: '50px',
        borderRadius: '4px',
      },
      cardStyle: { top: '70px', left: '20px' },
    });

    const MockResizeObserver = vi.fn().mockImplementation(function (cb) {
      lastObserverCallback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
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

  describe('Element Tracking - Fallback Path', () => {
    it('should handle fallback when element does not exist', () => {
      mockDocument.getElementById.mockReturnValue(null);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('non-existent-id', 0, 0, 'top', {});

      expect(service.isFallback()).toBe(true);
      expect(service.spotlightStyle()).toBeNull();
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle fallback when element has no offsetParent (hidden)', () => {
      const hiddenEl = { offsetParent: null, style: {} };
      mockDocument.getElementById.mockReturnValue(hiddenEl);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('hidden-element', 0, 0, 'top', {});

      expect(service.isFallback()).toBe(true);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
    });
  });

  describe('State Management', () => {
    it('should update signals when updatePosition is called directly', () => {
      const mockEl = { nodeType: 1 } as any;
      const expectedSpotlight = {
        top: '50px',
        left: '100px',
        width: '200px',
        height: '150px',
        borderRadius: '8px',
      };

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: false,
        spotlightStyle: expectedSpotlight as any,
        cardStyle: { top: '220px', left: '100px' } as any,
      });

      service.updatePosition(mockEl, 12, 24, 'right', { top: 10, left: 20 });

      expect(service.spotlightStyle()).toEqual(expectedSpotlight);
      expect(service.isFallback()).toBe(false);
    });

    it('should set null styles when in fallback mode', () => {
      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.updatePosition(null, 0, 0, 'top', {});

      expect(service.spotlightStyle()).toBeNull();
      expect(service.isFallback()).toBe(true);
    });
  });

  describe('Cleanup and Lifecycle', () => {
    it('should clean up observer and cancel animation frame on stopTracking', () => {
      (service as any).rafId = 999;

      service.stopTracking();

      expect(global.cancelAnimationFrame).toHaveBeenCalledWith(999);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
    });

    it('should handle stopTracking when nothing is tracking', () => {
      expect(() => service.stopTracking()).not.toThrow();
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
    });

    it('should clean up on ngOnDestroy', () => {
      const stopSpy = vi.spyOn(service, 'stopTracking');
      service.ngOnDestroy();
      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid startTracking calls by cleaning up previous tracking', () => {
      service.startTracking('el-1', 0, 0, 'top', {});
      service.startTracking('el-2', 0, 0, 'bottom', {});

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalled();
    });

    it('should handle different placement values', () => {
      const mockEl = { nodeType: 1 } as any;
      const placements: Array<'top' | 'bottom' | 'left' | 'right'> = [
        'top',
        'bottom',
      ];

      placements.forEach((placement) => {
        service.updatePosition(mockEl, 0, 0, placement, {});

        expect(modalConfig.calculateModalPositions).toHaveBeenLastCalledWith(
          mockEl,
          0,
          0,
          placement,
          {},
        );
      });
    });

    it('should pass offset values correctly', () => {
      const mockEl = { nodeType: 1 } as any;
      const offset = { top: 15, left: 25 };

      service.updatePosition(mockEl, 5, 10, 'top', offset);

      expect(modalConfig.calculateModalPositions).toHaveBeenCalledWith(
        mockEl,
        5,
        10,
        'top',
        offset,
      );
    });
  });
});
