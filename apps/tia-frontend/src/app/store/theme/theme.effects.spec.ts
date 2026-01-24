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
  const setAttributeSpy = vi.fn();
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  beforeEach(() => {
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
    getItemSpy.mockReturnValue(null);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply theme from action payload', () => {
    actions$ = of(ThemeActions.setTheme({ theme: 'ocean-blue' }));

    effects.syncTheme$.subscribe();
    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'oceanBlue');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'ocean-blue');
  });

  it('should load saved theme from localStorage after initialization', () => {
    getItemSpy.mockReturnValue('royal-blue');
    actions$ = of({ type: ROOT_EFFECTS_INIT });

    effects.syncTheme$.subscribe();
    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', 'royalBlue');
  });
});
