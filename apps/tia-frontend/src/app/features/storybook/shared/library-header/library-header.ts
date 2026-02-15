import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ColorSwitch } from '@tia/shared/lib/color-switching-buttons/color-switch/color-switch';
import { COLOR_SWITCH_DATA } from './config/color-switch-data';
import { Store } from '@ngrx/store';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { RouterLink } from '@angular/router';
import { LIBRARY_HEADER_CONFIG } from './config/library-header.config';
import { iLibHeader } from './model/library-header.models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-library-header',
  imports: [ColorSwitch, RouterLink, TranslatePipe],
  templateUrl: './library-header.html',
  styleUrl: './library-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryHeader {
  private store = inject(Store);
  private activeTheme = this.store.selectSignal(selectActiveTheme);
  public readonly headerConfig: iLibHeader = LIBRARY_HEADER_CONFIG;

  public colorConfigs = computed(() => {
    const currentTheme = this.activeTheme();
    return COLOR_SWITCH_DATA.map((btn) => ({
      ...btn,
      isActive: btn.color === currentTheme,
    }));
  });

  public setActiveColor(selectedColor: string): void {
    if (!selectedColor) return;
    this.store.dispatch(ThemeActions.setTheme({ theme: selectedColor }));
  }
}
