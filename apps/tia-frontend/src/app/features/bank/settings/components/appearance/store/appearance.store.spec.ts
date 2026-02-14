import { TestBed } from '@angular/core/testing';
import { AppearanceStore, initialState } from './appearance.store';
import { AppearanceService } from '../services/appearance-api.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

vi.mock('../config/appearance.config', () => ({
  themesConfig: [
    { value: 'oceanBlue', subtitle: 'Ocean subtitle' },
    { value: 'royalBlue', subtitle: 'Royal subtitle' },
  ],
}));

describe('AppearanceStore', () => {
  let store: InstanceType<typeof AppearanceStore>;
  let appearanceService: any;

  beforeEach(() => {
    appearanceService = {
      getAvailableThemes: vi.fn(),
      updateUserTheme: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AppearanceStore,
        { provide: AppearanceService, useValue: appearanceService },
      ],
    });

    store = TestBed.inject(AppearanceStore);
  });

  it('should have initial state', () => {
    expect(store.themes()).toEqual(initialState.themes);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.hasError()).toBe(false);
    expect(store.hasLoaded()).toBe(false);
  });

  it('should fetch themes successfully', async () => {
    const response = [
      { name: 'Ocean', value: 'oceanBlue' },
      { name: 'Royal', value: 'royalBlue' },
    ];
    appearanceService.getAvailableThemes.mockReturnValue(of(response));

    store.fetchThemes({ force: false });

    await vi.waitFor(() => {
      expect(store.isLoading()).toBe(false);
    });

    expect(store.themes().length).toBe(2);
    expect(store.hasLoaded()).toBe(true);
  });

  it('should update theme successfully', async () => {
    appearanceService.updateUserTheme.mockReturnValue(of({ success: true }));

    store.updateTheme('oceanBlue').subscribe();

    await vi.waitFor(() => {
      expect(store.isLoading()).toBe(false);
    });

    expect(store.hasError()).toBe(false);
  });

  it('should set error when update theme fails', async () => {
    appearanceService.updateUserTheme.mockReturnValue(
      throwError(() => new Error('fail')),
    );

    store.updateTheme('oceanBlue').subscribe();

    await vi.waitFor(() => {
      expect(store.hasError()).toBe(true);
    });

    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
  });
});
