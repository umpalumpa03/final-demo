import { TestBed } from '@angular/core/testing';
import { ThemeEffects } from './theme.effects';
import { ThemeActions } from './theme.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('ThemeEffects', () => {
  let actions$: Observable<Action>;
  let effects: ThemeEffects;
  let setAttributeSpy: any;

  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    setAttributeSpy = vi.fn();

    vi.stubGlobal('localStorage', localStorageMock);

    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        ThemeEffects,
        provideMockActions(() => actions$),
        {
          provide: DOCUMENT,
          useValue: { documentElement: { setAttribute: setAttributeSpy } },
        },
      ],
    });

    effects = TestBed.inject(ThemeEffects);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should apply theme from action payload', () => {
    actions$ = of(ThemeActions.setTheme({ theme: 'oceanBlue' }));

    effects.syncTheme$.subscribe();

    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'oceanBlue');

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'oceanBlue');
  });

  it('should load saved theme from localStorage after initialization', () => {
    const savedTheme = 'royalBlue';

    localStorageMock.getItem.mockReturnValue(savedTheme);

    actions$ = of({ type: ROOT_EFFECTS_INIT });

    effects.syncTheme$.subscribe();

    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', savedTheme);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', savedTheme);
  });
});
