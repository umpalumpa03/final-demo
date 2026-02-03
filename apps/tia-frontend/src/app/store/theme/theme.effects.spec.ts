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
  let getItemSpy: any;
  let setItemSpy: any;

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
    vi.restoreAllMocks();
  });

  it('should apply theme from action payload', () => {
    const inputTheme = 'ocean-blue';

    const expectedDomTheme = 'oceanBlue';

    actions$ = of(ThemeActions.setTheme({ theme: inputTheme }));

    effects.syncTheme$.subscribe();

    expect(setAttributeSpy).toHaveBeenCalledWith(
      'data-theme',
      expectedDomTheme,
    );

    expect(setItemSpy).toHaveBeenCalledWith('theme', inputTheme);
  });

  it('should load saved theme from localStorage after initialization', () => {
    const savedTheme = 'royalBlue';

    getItemSpy.mockReturnValue(savedTheme);

    actions$ = of({ type: ROOT_EFFECTS_INIT });

    effects.syncTheme$.subscribe();

    expect(setAttributeSpy).toHaveBeenCalledWith('data-theme', savedTheme);
  });
});
