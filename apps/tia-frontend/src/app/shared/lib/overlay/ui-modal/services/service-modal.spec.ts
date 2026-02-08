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
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn().mockImplementation((cb) => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        trigger: () => cb(),
      })),
    );

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

  describe('updatePosition & Observer logic', () => {
    it('should handle isFallback state and clear signals', () => {
      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null as any,
        cardStyle: null as any,
      });

      service.updatePosition(null, 0, 0, 'top' as any, { x: 0, y: 0 });

      expect(service.isFallback()).toBe(true);
      expect(service.spotlightStyle()).toEqual({});
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
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

    it('should update position with element when it is found and visible', () => {
      const mockEl = { offsetParent: {}, contains: () => true } as any;
      const updateSpy = vi.spyOn(service, 'updatePosition');

      service.startTracking(mockEl, 10, 5, 'bottom' as any, {});

      expect(updateSpy).toHaveBeenCalledWith(mockEl, 10, 5, 'bottom', {});
    });

    it('cleanupObserver should do nothing if no observer exists', () => {
      (service as any).observer = null;
      expect(() => (service as any).cleanupObserver()).not.toThrow();
    });

    it('should set fallback and schedule a retry when the element is hidden or missing', () => {
      const mockEl = { offsetParent: null } as unknown as HTMLElement;
      vi.spyOn(documentMock, 'getElementById').mockReturnValue(mockEl);

      const rafSpy = vi.fn().mockReturnValue(123);
      vi.stubGlobal('requestAnimationFrame', rafSpy);

      const updateSpy = vi.spyOn(service, 'updatePosition');

      service.startTracking('hidden-element', 10, 5, 'top' as any, {});

      expect(updateSpy).toHaveBeenCalledWith(null, 10, 5, 'top', {});
      expect(rafSpy).toHaveBeenCalled();
      expect(rafSpy).toHaveBeenCalledWith(expect.any(Function));
      expect((service as any).rafId).toBe(123);
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
  });
});
