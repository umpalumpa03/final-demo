import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppearanceContainer } from './appearance-container';
import { Store } from '@ngrx/store';
import { AppearanceService } from '../services/appearance.service';
import { of } from 'rxjs';
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
      getAvailableThemes: vi.fn().mockReturnValue(of([{ name: 'Light', value: 'light' }])),
      updateUserTheme: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [AppearanceContainer, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: { selectSignal: () => signal(null), dispatch: vi.fn() } },
      ],
    }).overrideComponent(AppearanceContainer, {
      set: { providers: [{ provide: AppearanceService, useValue: appearanceService }] }
    }).compileComponents();

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
    
    component.setActiveColor(''); // Test early return
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

    it('should handle unsaved changes - confirm true', () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });
      
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const dispatchSpy = vi.spyOn((component as any).store, 'dispatch');

      expect(component.canDeactivate()).toBe(true);
      expect(dispatchSpy).toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('should handle unsaved changes - confirm false', () => {
      (component as any).isSubmitted = signal(false);
      (component as any).activeTheme = signal('new-theme');
      (component as any).userInfo = signal({ theme: 'old-theme' });
      
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      expect(component.canDeactivate()).toBe(false);
    });

    it('should return true if no saved theme or no changes', () => {
      (component as any).userInfo = signal(null);
      expect(component.canDeactivate()).toBe(true);
    });
  });
});