import { TestBed } from '@angular/core/testing';
import { LibraryHeader } from './library-header';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { COLOR_SWITCH_DATA } from './config/color-switch-data';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LibraryHeader', () => {
  let fixture: any, component: LibraryHeader, store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibraryHeader],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectActiveTheme, value: 'light-theme' }],
        }),
      ],
    });

    fixture = TestBed.createComponent(LibraryHeader);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should dispatch theme action on color selection', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const target = COLOR_SWITCH_DATA[0].color;

    component.setActiveColor(target);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ThemeActions.setTheme({ theme: target }),
    );
  });

  it('should not dispatch if color is invalid', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.setActiveColor(null as any);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should render buttons and reflect active state (DOM Test)', () => {
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('app-color-switch'));
    expect(buttons.length).toBe(COLOR_SWITCH_DATA.length);

    const methodSpy = vi.spyOn(component, 'setActiveColor');
    buttons[0].triggerEventHandler('selected', 'blue');
    expect(methodSpy).toHaveBeenCalledWith('blue');
  });

  it('should update computed signal based on store', () => {
    const newTheme = COLOR_SWITCH_DATA[1].color;
    store.overrideSelector(selectActiveTheme, newTheme);
    store.refreshState();

    const activeItem = component.colorConfigs().find((i) => i.isActive);
    expect(activeItem?.color).toBe(newTheme);
  });
});
