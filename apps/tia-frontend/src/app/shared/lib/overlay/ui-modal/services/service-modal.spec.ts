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
  let mockDocument: Document;
  let lastObserverCallback: ResizeObserverCallback | null = null;
  let mockResizeObserver: any;

  beforeEach(() => {
    mockDocument = document.implementation.createHTMLDocument('Test');

    if (!mockDocument.body) {
      mockDocument.body = mockDocument.createElement('body');
      mockDocument.documentElement.appendChild(mockDocument.body);
    }

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: {
        top: '10px',
        left: '20px',
        width: '100px',
        height: '50px',
        borderRadius: '4px',
      },
      cardStyle: {
        top: '70px',
        left: '20px',
      },
    });

    const MockResizeObserver = vi.fn().mockImplementation(function (
      cb: ResizeObserverCallback,
    ) {
      lastObserverCallback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    mockResizeObserver = MockResizeObserver;
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb) => {
        return 123;
      }),
    );
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
    mockResizeObserver = null;
  });

  describe('Element Tracking - Fallback Path', () => {
    it('should handle fallback when element does not exist', () => {
      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('non-existent-id', 0, 0, 'top', {});

      expect(service.isFallback()).toBe(true);
      expect(service.spotlightStyle()).toBeNull();
      expect(service.cardStyle()).toBeNull();

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle fallback when element has no offsetParent (hidden)', () => {
      const mockEl = mockDocument.createElement('div');
      mockEl.id = 'hidden-element';
      mockEl.style.display = 'none';
      mockDocument.body.appendChild(mockEl);

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
      const mockEl = mockDocument.createElement('div');
      mockDocument.body.appendChild(mockEl);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: false,
        spotlightStyle: {
          top: '50px',
          left: '100px',
          width: '200px',
          height: '150px',
          borderRadius: '8px',
        },
        cardStyle: { top: '220px', left: '100px' },
      });

      service.updatePosition(mockEl, 12, 24, 'right', { top: 10, left: 20 });

      expect(service.spotlightStyle()).toEqual({
        top: '50px',
        left: '100px',
        width: '200px',
        height: '150px',
        borderRadius: '8px',
      });
      expect(service.cardStyle()).toEqual({
        top: '220px',
        left: '100px',
      });
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
      expect(service.cardStyle()).toBeNull();
      expect(service.isFallback()).toBe(true);
    });
  });

  describe('Cleanup and Lifecycle', () => {
    it('should clean up observer and cancel animation frame on stopTracking', () => {
      const mockEl = mockDocument.createElement('div');
      mockEl.id = 'cleanup-test';
      mockEl.style.position = 'relative';
      mockDocument.body.appendChild(mockEl);

      service.startTracking('cleanup-test', 0, 0, 'top', {});

      (service as any).rafId = 999;

      const cancelSpy = vi.mocked(global.cancelAnimationFrame);
      const toggleSpy = vi.mocked(modalConfig.toggleBodyScroll);

      service.stopTracking();

      expect(cancelSpy).toHaveBeenCalledWith(999);

      expect(toggleSpy).toHaveBeenCalledWith(false);
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

  describe('Observer Management', () => {
    it('should disconnect observer when entering fallback mode', () => {
      const mockEl = mockDocument.createElement('div');
      mockEl.style.position = 'relative';
      mockDocument.body.appendChild(mockEl);

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: false,
        spotlightStyle: {
          top: '0px',
          left: '0px',
          width: '100px',
          height: '100px',
          borderRadius: '4px',
        },
        cardStyle: { top: '0px', left: '0px' },
      });

      service.updatePosition(mockEl, 0, 0, 'top', {});

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.updatePosition(null, 0, 0, 'top', {});

      expect((service as any).observer).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid startTracking calls by cleaning up previous tracking', () => {
      const el1 = mockDocument.createElement('div');
      el1.id = 'el-1';
      el1.style.position = 'relative';
      mockDocument.body.appendChild(el1);

      const el2 = mockDocument.createElement('div');
      el2.id = 'el-2';
      el2.style.position = 'relative';
      mockDocument.body.appendChild(el2);

      service.startTracking('el-1', 0, 0, 'top', {});
      service.startTracking('el-2', 0, 0, 'bottom', {});

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(true);
    });

    it('should handle different placement values', () => {
      const mockEl = mockDocument.createElement('div');
      mockEl.style.position = 'relative';
      mockDocument.body.appendChild(mockEl);

      const placements: Array<'top' | 'bottom' | 'left' | 'right'> = [
        'top',
        'bottom',
        'left',
        'right',
      ];

      placements.forEach((placement) => {
        service.updatePosition(mockEl, 0, 0, placement, {});
        expect(modalConfig.calculateModalPositions).toHaveBeenCalledWith(
          mockEl,
          0,
          0,
          placement,
          {},
        );
      });
    });

    it('should pass offset values correctly', () => {
      const mockEl = mockDocument.createElement('div');
      mockEl.style.position = 'relative';
      mockDocument.body.appendChild(mockEl);

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
