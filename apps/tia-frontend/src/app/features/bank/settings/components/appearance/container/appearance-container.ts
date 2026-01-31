import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { themesConfig } from '../config/appearance.config';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { AppearanceService } from '../services/appearance.service';
import { map, tap } from 'rxjs';
import { TAvailableThemes } from '../models/appearance.model';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { Skeleton } from "@tia/shared/lib/feedback/skeleton/skeleton";

@Component({
  selector: 'app-appearance-container',
  imports: [SettingsBody, TranslatePipe, ButtonComponent, Skeleton],
  providers: [AppearanceService],
  templateUrl: './appearance-container.html',
  styleUrl: './appearance-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceContainer {
  private store = inject(Store);
  private appearanceService = inject(AppearanceService);
  private destroyRef = inject(DestroyRef);

  private activeTheme = this.store.selectSignal(selectActiveTheme);
  public availableThemes = signal<TAvailableThemes | null>(null);

  public isLoading = this.appearanceService.isLoading;
  
  private lastSavedTheme = signal<string | null>(null);


  ngOnInit(): void {
    const subscription = this.appearanceService.getAvailableThemes().pipe(
      map((themes) => {
        return[...themes].map((theme, index) => ({
          ...theme,
          subtitle: themesConfig[index].subtitle
        }));
      }),
      tap(themes => {
        this.availableThemes.set(themes);
      })
    ).subscribe();
    
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public isCurrentTheme(theme: string) {
    return this.activeTheme() === theme;
  }

  public onClick(selectedColor: string): void {
    this.setActiveColor(selectedColor)
  }

  public setActiveColor(selectedColor: string): void {
    if (!selectedColor) return;
    this.store.dispatch(ThemeActions.setTheme({ theme: selectedColor }));
  }

  public getThemeColor(themeKey: string, cssVariable: string): string {
    const tempEl = document.createElement('div');
    tempEl.setAttribute('data-theme', themeKey);
    tempEl.style.display = 'none';
    document.body.appendChild(tempEl);

    const color = getComputedStyle(tempEl).getPropertyValue(cssVariable).trim();
    document.body.removeChild(tempEl);

    return color;
  }

  public onSubmit(): void {
    this.appearanceService.updateUserTheme(this.activeTheme()).subscribe();
  }

}
