import { TestBed } from '@angular/core/testing';
import { ThemeEffects } from './theme.effects';
import { ThemeActions } from './theme.actions';
import { Observable, of, Subscription } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { DOCUMENT } from '@angular/common';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  MockInstance,
} from 'vitest';

describe('ThemeEffects', () => {
  let actions$: Observable<Action>;
  let effects: ThemeEffects;
  let subscription: Subscription;
  let setItemSpy: MockInstance;
  let getItemSpy: MockInstance;

  const mockDocument = {
    documentElement: {
      setAttribute: vi.fn(),
    },
  };

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        ThemeEffects,
        provideMockActions(() => actions$),
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    effects = TestBed.inject(ThemeEffects);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    subscription?.unsubscribe();
  });

  it('should set theme on website and localStorage when setTheme is dispatched', () => {
    const theme = 'ocean-blue';
    actions$ = of(ThemeActions.setTheme({ theme }));

    subscription = effects.syncTheme$.subscribe();

    expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'oceanBlue',
    );
    expect(setItemSpy).toHaveBeenCalledWith('theme', theme);
  });

  it('should initialize theme from localStorage on ROOT_EFFECTS_INIT', () => {
    const savedTheme = 'royal-blue';
    getItemSpy.mockReturnValue(savedTheme);

    actions$ = of({ type: ROOT_EFFECTS_INIT });

    subscription = effects.syncTheme$.subscribe();

    expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'royalBlue',
    );
  });

  it('should fallback to default theme if localStorage is empty', () => {
    getItemSpy.mockReturnValue(null);
    actions$ = of({ type: ROOT_EFFECTS_INIT });

    subscription = effects.syncTheme$.subscribe();
    expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'oceanBlue',
    );
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'ocean-blue');
  });
});
