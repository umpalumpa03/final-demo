import { TestBed } from '@angular/core/testing';
import { ModalResponsiveService } from './service-modal';
import { DOCUMENT } from '@angular/common';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as modalConfig from '../config/ui-modal.config';
import { PLATFORM_ID } from '@angular/core';

vi.mock('../config/ui-modal.config', () => ({
  calculateModalPositions: vi.fn(),
  toggleBodyScroll: vi.fn(),
}));

describe('ModalResponsiveService', () => {
  let service: ModalResponsiveService;
  let mockDocument: any;
  let lastObserverCallback: (() => void) | null = null;

  beforeEach(() => {
    mockDocument = {
      getElementById: vi.fn(),
      body: {
        contains: vi.fn().mockReturnValue(true),
      },
    };

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: {} as any,
      cardStyle: {} as any,
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

  describe('Tracking Logic', () => {
    it('should skip tracking if not in browser', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ModalResponsiveService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      const serverService = TestBed.inject(ModalResponsiveService);
      const updateSpy = vi.spyOn(serverService, 'updatePosition');

      serverService.startTracking('any-id', 0, 0, 'top' as any, {});

      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should track an element and start observer', () => {
      const mockEl = { nodeType: 1 } as any;

      vi.spyOn(mockDocument, 'getElementById').mockReturnValue(mockEl);

      const updateSpy = vi.spyOn(service, 'updatePosition');

      service.startTracking('my-id', 8, 16, 'bottom' as any, {});

      expect(updateSpy).toHaveBeenCalledWith(mockEl, 8, 16, 'bottom', {});

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(true);
    });

    it('should handle fallback when element is missing', () => {
      vi.spyOn(mockDocument, 'getElementById').mockReturnValue(null);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('missing-id', 0, 0, 'top' as any, {});

      expect(service.isFallback()).toBe(true);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should call updatePosition on ResizeObserver callback', () => {
      const mockEl = { nodeType: 1 } as any;
      vi.spyOn(mockDocument, 'getElementById').mockReturnValue(mockEl);

      service.startTracking('my-id', 0, 0, 'top' as any, {});

      const updateSpy = vi.spyOn(service, 'updatePosition');

      expect(lastObserverCallback).toBeTruthy();
      if (lastObserverCallback) {
        lastObserverCallback();
      }

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should clean up on stopTracking', () => {
      (service as any).rafId = 123;

      service.stopTracking();

      expect(global.cancelAnimationFrame).toHaveBeenCalledWith(123);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
    });
  });
});
