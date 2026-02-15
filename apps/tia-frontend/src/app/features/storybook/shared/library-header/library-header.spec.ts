import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryHeader } from './library-header';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { COLOR_SWITCH_DATA } from './config/color-switch-data';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('LibraryHeader', () => {
  let fixture: ComponentFixture<LibraryHeader>;
  let component: LibraryHeader;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibraryHeader, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            {
              selector: selectActiveTheme,
              value: COLOR_SWITCH_DATA[0].color,
            },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(LibraryHeader);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should render buttons and mark the active theme correctly', () => {
    const buttons = fixture.debugElement.queryAll(By.css('app-color-switch'));

    expect(buttons.length).toBe(COLOR_SWITCH_DATA.length);

    const activeBtn = buttons.find((b) => {
      const prop = b.componentInstance.isActive;
      return typeof prop === 'function' ? prop() === true : prop === true;
    });

    expect(activeBtn).toBeTruthy();
  });

  it('should dispatch theme action when a button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const targetColor = COLOR_SWITCH_DATA[0].color;
    const button = fixture.debugElement.queryAll(By.css('app-color-switch'))[0];
    button.triggerEventHandler('selected', targetColor);
    expect(dispatchSpy).toHaveBeenCalledWith(
      ThemeActions.setTheme({ theme: targetColor }),
    );
  });
});
