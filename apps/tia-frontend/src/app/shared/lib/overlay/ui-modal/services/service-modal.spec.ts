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
  let documentMock: Document;

  beforeEach(() => {
    const ResizeObserverMock = vi.fn().mockImplementation(function (
      this: any,
      callback: any,
    ) {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();

      this.trigger = () =>
        callback([{ target: {} } as ResizeObserverEntry], {} as ResizeObserver);
      return this;
    });

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb) => cb()),
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    TestBed.configureTestingModule({
      providers: [
        ModalResponsiveService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: DOCUMENT,
          useValue: {
            body: { contains: vi.fn(() => true) },
            getElementById: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(ModalResponsiveService);
    documentMock = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startTracking', () => {
    it('should return immediately if platform is not a browser', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ModalResponsiveService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      const serverService = TestBed.inject(ModalResponsiveService);
      const updateSpy = vi.spyOn(serverService, 'updatePosition');

      serverService.startTracking('target', 0, 0, 'top' as any, { x: 0, y: 0 });

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('stopTracking should clean up resources', () => {
      (service as any).rafId = 42;
      (service as any).observer = { disconnect: vi.fn() };

      service.stopTracking();

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
      expect(global.cancelAnimationFrame).toHaveBeenCalledWith(42);
      expect((service as any).observer).toBeNull();
    });

    it('ngOnDestroy should call stopTracking', () => {
      const spy = vi.spyOn(service, 'stopTracking');
      service.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });

    it('cleanupObserver should do nothing if no observer exists', () => {
      (service as any).observer = null;
      expect(() => (service as any).cleanupObserver()).not.toThrow();
    });

    it('should NOT re-initialize observer if one already exists', () => {
      const mockEl = { nodeType: 1 } as unknown as HTMLElement;
      (service as any).observer = { observe: vi.fn(), disconnect: vi.fn() };

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: false,
        spotlightStyle: {} as any,
        cardStyle: {} as any,
      });

      const observerSpy = vi.spyOn(global, 'ResizeObserver');

      service.updatePosition(mockEl, 0, 0, 'top' as any, {});

      expect(observerSpy).not.toHaveBeenCalled();
    });

    it('should clear styles and cleanup observer when isFallback is true', () => {
      (service as any).observer = { disconnect: vi.fn() };
      const disconnectSpy = vi.spyOn((service as any).observer, 'disconnect');

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.updatePosition(null, 8, 16, 'bottom' as any, {});

      expect(service.isFallback()).toBe(true);
      expect(service.spotlightStyle()).toBeNull();
      expect(service.cardStyle()).toBeNull();
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
      expect(disconnectSpy).toHaveBeenCalled();
      expect((service as any).observer).toBeNull();
    });

    it('should call updatePosition when the ResizeObserver detects a change', () => {
      const mockEl = { nodeType: 1 } as unknown as HTMLElement;
      const updateSpy = vi.spyOn(service, 'updatePosition');

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: false,
        spotlightStyle: {} as any,
        cardStyle: {} as any,
      });

      service.updatePosition(mockEl, 8, 16, 'bottom' as any, {});

      updateSpy.mockClear();

      const observerInstance = (service as any).observer;
      (observerInstance as any).trigger();

      expect(updateSpy).toHaveBeenCalledWith(mockEl, 8, 16, 'bottom', {});
    });
  });
});
