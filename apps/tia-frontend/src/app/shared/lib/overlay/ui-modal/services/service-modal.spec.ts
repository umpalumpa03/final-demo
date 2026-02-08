import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalResponsiveService } from './service-modal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as modalConfig from '../config/ui-modal.config';

vi.mock('../config/ui-modal.config', () => ({
  calculateModalPositions: vi.fn(),
  toggleBodyScroll: vi.fn(),
}));

@Component({
  template: `
    <div
      id="test-target"
      style="position: relative; width: 100px; height: 100px;"
    ></div>
  `,
  standalone: true,
})
class TestHostComponent {}

describe('ModalResponsiveService (Component Integration)', () => {
  let service: ModalResponsiveService;
  let fixture: ComponentFixture<TestHostComponent>;
  let lastObserverCallback: ResizeObserverCallback | null = null;
  let targetEl: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(123));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const MockResizeObserver = vi.fn().mockImplementation(function (cb) {
      lastObserverCallback = cb;
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    });
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
      isFallback: false,
      spotlightStyle: { top: '10px' } as any,
      cardStyle: { top: '50px' } as any,
    });

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        ModalResponsiveService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    service = TestBed.inject(ModalResponsiveService);
    fixture.detectChanges();

    document.body.appendChild(fixture.nativeElement);

    targetEl = fixture.nativeElement.querySelector('#test-target');
    Object.defineProperty(targetEl, 'offsetParent', {
      get: () => document.body,
    });
  });

  afterEach(() => {
    service.stopTracking();

    document.body.removeChild(fixture.nativeElement);
    fixture.destroy();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    lastObserverCallback = null;
  });

  describe('Tracking Logic', () => {
    it('should find element by ID and start tracking', () => {
      service.startTracking('test-target', 0, 0, 'bottom', {});

      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(true);
      expect(service.isFallback()).toBe(false);

      expect(ResizeObserver).toHaveBeenCalled();
    });

    it('should handle fallback when element ID does not exist', () => {
      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue({
        isFallback: true,
        spotlightStyle: null,
        cardStyle: null,
      });

      service.startTracking('non-existent-id', 0, 0, 'bottom', {});

      expect(service.isFallback()).toBe(true);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should update signals on ResizeObserver trigger', () => {
      service.startTracking('test-target', 0, 0, 'bottom', {});

      const updateSpy = vi.spyOn(service, 'updatePosition');

      if (lastObserverCallback) {
        lastObserverCallback([], {} as any);
      }

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should stop tracking and cleanup correctly', () => {
      service.startTracking('test-target', 0, 0, 'bottom', {});

      (service as any).rafId = 555;

      service.stopTracking();

      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(555);
      expect(modalConfig.toggleBodyScroll).toHaveBeenCalledWith(false);
    });

    it('should handle direct updatePosition calls with real elements', () => {
      const mockResult = {
        isFallback: false,
        spotlightStyle: { width: '500px' } as any,
        cardStyle: { top: '200px' } as any,
      };

      vi.mocked(modalConfig.calculateModalPositions).mockReturnValue(
        mockResult,
      );

      service.updatePosition(targetEl, 0, 0, 'top', {});

      expect(service.spotlightStyle()).toEqual(mockResult.spotlightStyle);
    });
  });
});
