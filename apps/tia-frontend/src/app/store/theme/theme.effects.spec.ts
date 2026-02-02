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
  let setAttributeSpy: ReturnType<typeof vi.fn>;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setAttributeSpy = vi.fn();
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});

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
