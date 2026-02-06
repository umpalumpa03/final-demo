import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { NavigationService } from './core/services/navigation/navigation.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('App Component', () => {
  let translateService: TranslateService;
  let mockNavigationService: any;

  beforeEach(async () => {
    mockNavigationService = {
      isFeatureLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize with default translation setup', () => {
    const useSpy = vi.spyOn(translateService, 'use');
    TestBed.createComponent(App);

    expect(useSpy).toHaveBeenCalled();
  });

  it('should reflect the loading state from NavigationService', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    mockNavigationService.isFeatureLoading.set(true);
    expect((app as any).isLoading()).toBe(true);

    mockNavigationService.isFeatureLoading.set(false);
    expect((app as any).isLoading()).toBe(false);
  });
});
