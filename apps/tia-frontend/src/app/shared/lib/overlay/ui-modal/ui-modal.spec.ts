import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { UiModal } from './ui-modal';
import { ModalResponsiveService } from './services/service-modal';

describe('UiModal Integration', () => {
  let component: UiModal;
  let fixture: ComponentFixture<UiModal>;
  let modalService: ModalResponsiveService;

  beforeEach(async () => {
    const modalServiceMock = {
      startTracking: vi.fn(),
      stopTracking: vi.fn(),
      spotlightStyle: vi.fn(() => ({})),
      cardStyle: vi.fn(() => ({})),
      isFallback: vi.fn(() => false),
    };

    await TestBed.configureTestingModule({
      imports: [UiModal],
      providers: [
        { provide: ModalResponsiveService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiModal);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalResponsiveService);

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  describe('Tracking Effect Logic', () => {
    it('should call startTracking when modal opens with a target', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('target', 'test-id');
      fixture.detectChanges();

      expect(modalService.startTracking).toHaveBeenCalledWith(
        'test-id',
        8,
        16,
        'bottom',
        {},
      );
    });

    it('should call stopTracking when modal closes', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      expect(modalService.stopTracking).toHaveBeenCalled();
    });

    it('should re-trigger tracking on window resize if open', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('target', 'test-id');
      fixture.detectChanges();

      vi.mocked(modalService.startTracking).mockClear();

      window.dispatchEvent(new Event('resize'));

      expect(modalService.startTracking).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation Integration', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('hasNavigation', true);
      fixture.detectChanges();
    });

    it('should emit navigate(1) on Right Arrow key press', () => {
      const navigateSpy = vi.spyOn(component.navigate, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);

      expect(navigateSpy).toHaveBeenCalledWith(1);
    });

    it('should NOT navigate if modal is closed', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      const navigateSpy = vi.spyOn(component.navigate, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Computed State Logic', () => {
    it('should correctly compute isTutorialActive', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('target', 'some-id');

      (modalService as any).isFallback.set?.(false);

      fixture.detectChanges();

      expect((component as any).isTutorialActive()).toBe(true);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call stopTracking on ngOnDestroy', () => {
      component.ngOnDestroy();
      expect(modalService.stopTracking).toHaveBeenCalled();
    });

    it('should NOT emit navigate when Left Arrow is pressed if hasNavigation is false', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('hasNavigation', false);
      fixture.detectChanges();

      const navigateSpy = vi.spyOn(component.navigate, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
