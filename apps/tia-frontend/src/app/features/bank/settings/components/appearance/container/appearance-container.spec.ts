import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppearanceContainer } from './appearance-container';
import { Store } from '@ngrx/store';
import { AppearanceService } from '../services/appearance.service';
import { Observable, of } from 'rxjs';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AppearanceContainer', () => {
  let component: AppearanceContainer;
  let fixture: ComponentFixture<AppearanceContainer>;
  let appearanceService: any;

  beforeEach(async () => {
    appearanceService = {
      isLoading: signal(false),
      getAvailableThemes: vi
        .fn()
        .mockReturnValue(of([{ name: 'Light', value: 'light' }])),
      updateUserTheme: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [AppearanceContainer, TranslateModule.forRoot()],
      providers: [
        {
          provide: Store,
          useValue: { selectSignal: () => signal(null), dispatch: vi.fn() },
        },
      ],
    })
      .overrideComponent(AppearanceContainer, {
        set: {
          providers: [
            { provide: AppearanceService, useValue: appearanceService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppearanceContainer);
    component = fixture.componentInstance;
  });

  it('should cover ngOnInit and theme mapping', () => {
    fixture.detectChanges();
    expect(component.availableThemes()![0]).toHaveProperty('subtitle');
  });

  it('should cover onClick and setActiveColor', () => {
    const dispatchSpy = vi.spyOn((component as any).store, 'dispatch');
    component.onClick('dark');
    expect(dispatchSpy).toHaveBeenCalled();

    component.setActiveColor('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should cover isCurrentTheme', () => {
    (component as any).activeTheme = signal('dark');
    expect(component.isCurrentTheme('dark')).toBe(true);
    expect(component.isCurrentTheme('light')).toBe(false);
  });

  it('should cover getThemeColor DOM logic', () => {
    const color = component.getThemeColor('dark', '--test');
    expect(typeof color).toBe('string');
  });

  it('should cover onSubmit', () => {
    component.onSubmit();
    expect(appearanceService.updateUserTheme).toHaveBeenCalled();
    expect((component as any).isSubmitted()).toBe(true);
  });

  describe('canDeactivate line coverage', () => {
    it('should return true if submitted', () => {
      (component as any).isSubmitted = signal(true);
      expect(component.canDeactivate()).toBe(true);
    });

    it('should handle unsaved changes - modal opens and user leaves', async () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });

      const dispatchSpy = vi.spyOn((component as any).store, 'dispatch');
      const result = component.canDeactivate();

      expect(component.isModalOpen()).toBe(true);
      expect(result).toBeInstanceOf(Object);

      const canLeavePromise = new Promise<boolean>((resolve) => {
        (result as Observable<boolean>).subscribe((canLeave) => {
          resolve(canLeave);
        });
      });

      component.onLeave();

      const canLeave = await canLeavePromise;
      expect(canLeave).toBe(true);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should handle unsaved changes - modal opens and user stays', async () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });

      const result = component.canDeactivate();

      expect(component.isModalOpen()).toBe(true);
      expect(result).toBeInstanceOf(Object);

      const canLeavePromise = new Promise<boolean>((resolve) => {
        (result as Observable<boolean>).subscribe((canLeave) => {
          resolve(canLeave);
        });
      });

      component.onStay();

      const canLeave = await canLeavePromise;
      expect(canLeave).toBe(false);
      expect(component.isModalOpen()).toBe(false);
    });

    it('should return true if no saved theme or no changes', () => {
      (component as any).userInfo = signal(null);
      expect(component.canDeactivate()).toBe(true);
    });
  });

  describe('alert functionality', () => {
    it('should show success alert on successful submit', async () => {
      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(component.alertType()).toBe('success');
      expect(component.alertMessage()).toContain('');
    });

    it('should show error alert on failed submit', async () => {
      appearanceService.updateUserTheme.mockReturnValue(
        new Observable((observer) => observer.error(new Error('Save failed'))),
      );

      component.onSubmit();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(component.alertType()).toBe('error');
    });

    it('should clear alert timeout on destroy', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      (component as any).alertTimeoutId = setTimeout(() => {}, 1000);

      component.ngOnDestroy();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect((component as any).alertTimeoutId).toBeNull();
    });

    it('should not throw error if no timeout on destroy', () => {
      (component as any).alertTimeoutId = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('modal interactions', () => {
    it('should toggle modal', () => {
      expect(component.isModalOpen()).toBe(false);
      component.toggleModal();
      expect(component.isModalOpen()).toBe(true);
      component.toggleModal();
      expect(component.isModalOpen()).toBe(false);
    });

    it('should handle onStay - close modal and emit false', async () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });

      component.isModalOpen.set(true);
      const result = component.canDeactivate();

      const canLeavePromise = new Promise<boolean>((resolve) => {
        (result as Observable<boolean>).subscribe((canLeave) => {
          resolve(canLeave);
        });
      });

      component.onStay();

      const canLeave = await canLeavePromise;
      expect(canLeave).toBe(false);
      expect(component.isModalOpen()).toBe(false);
    });

    it('should handle onLeave - reset theme and emit true', async () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });

      const dispatchSpy = vi.spyOn((component as any).store, 'dispatch');
      const result = component.canDeactivate();

      const canLeavePromise = new Promise<boolean>((resolve) => {
        (result as Observable<boolean>).subscribe((canLeave) => {
          resolve(canLeave);
        });
      });

      component.onLeave();

      const canLeave = await canLeavePromise;
      expect(canLeave).toBe(true);
      expect(component.isModalOpen()).toBe(false);
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
