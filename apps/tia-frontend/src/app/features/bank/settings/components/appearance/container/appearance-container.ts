import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { themes, getThemeColor } from '../config/appearance.config';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';

@Component({
  selector: 'app-appearance-container',
  imports: [SettingsBody, TranslatePipe],
  templateUrl: './appearance-container.html',
  styleUrl: './appearance-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceContainer {
  private store = inject(Store);
  private activeTheme = this.store.selectSignal(selectActiveTheme);
  
  public readonly themesWithColors = computed(() =>
    themes.map((theme) => ({
      ...theme,
      colorValue: getThemeColor(theme.themeKey, theme.cssVariable),
    })),
  );

  public isCurrentTheme(theme: string) {
    return this.activeTheme() === theme;
  }

  public onClick(selectedColor: string): void {
    // const el = event.currentTarget as HTMLElement;
    // if(!el) return;
    // el.classList.toggle('active');
    this.setActiveColor(selectedColor)
  }

  public setActiveColor(selectedColor: string): void {
    if (!selectedColor) return;
    this.store.dispatch(ThemeActions.setTheme({ theme: selectedColor }));
  }
}
