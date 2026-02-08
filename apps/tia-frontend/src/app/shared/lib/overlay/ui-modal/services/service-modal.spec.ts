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

  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    static lastCallback: any;
    constructor(callback: any) {
      MockResizeObserver.lastCallback = callback;
    }
  }

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb) => setTimeout(cb, 0)),
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn((id) => clearTimeout(id)),
    );

    TestBed.configureTestingModule({
      providers: [
        ModalResponsiveService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: document },
      ],
    });

    service = TestBed.inject(ModalResponsiveService);
    documentMock = TestBed.inject(DOCUMENT);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should cover server-side guard', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ModalResponsiveService,
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    const serverService = TestBed.inject(ModalResponsiveService);
    const spy = vi.spyOn(serverService, 'updatePosition');
    serverService.startTracking('id', 0, 0, 'top' as any, {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('should track an element and start observer', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      spotlightStyle: {} as any,
      cardStyle: {} as any,
      isFallback: false,
    });

    service.startTracking(el, 8, 16, 'bottom' as any, {});

    expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(true);
    expect(service.isFallback()).toBe(false);

    document.body.removeChild(el);
  });

  it('should handle fallback when element is missing', () => {
    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      spotlightStyle: null,
      cardStyle: null,
      isFallback: true,
    });

    service.updatePosition(null, 0, 0, 'bottom' as any, {});

    expect(service.isFallback()).toBe(true);
    expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
  });

  it('should call updatePosition on ResizeObserver callback', () => {
    const el = document.createElement('div');
    const spy = vi.spyOn(service, 'updatePosition');

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: {} as any,
      cardStyle: {} as any,
    });

    service.updatePosition(el, 8, 16, 'bottom' as any, {});
    spy.mockClear();

    MockResizeObserver.lastCallback();
    expect(spy).toHaveBeenCalled();
  });

  it('should clean up on stopTracking', () => {
    (service as any).rafId = 123;
    service.stopTracking();
    expect(global.cancelAnimationFrame).toHaveBeenCalledWith(123);
    expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
  });
});
