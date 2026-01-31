import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { themesConfig } from '../config/appearance.config';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { AppearanceService } from '../services/appearance.service';
import { TAvailableThemes } from '../models/appearance.model';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { Skeleton } from "@tia/shared/lib/feedback/skeleton/skeleton";
import { selectUserInfo } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { CanComponentDeactivate } from '../guard/unsaved-changes.guard';

@Component({
  selector: 'app-appearance-container',
  imports: [SettingsBody, TranslatePipe, ButtonComponent, Skeleton],
  providers: [AppearanceService],
  templateUrl: './appearance-container.html',
  styleUrl: './appearance-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceContainer implements OnInit, CanComponentDeactivate {
  private store = inject(Store);
  private appearanceService = inject(AppearanceService);
  private destroyRef = inject(DestroyRef);

  private activeTheme = this.store.selectSignal(selectActiveTheme);
  public availableThemes = signal<TAvailableThemes | null>(null);

  public isLoading = this.appearanceService.isLoading;

  private isSubmitted = signal(false);
  
  private userInfo = this.store.selectSignal(selectUserInfo);

  public ngOnInit(): void {
    this.isSubmitted.set(false);
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
    const subscription = this.appearanceService.updateUserTheme(this.activeTheme()).pipe(
      tap(() => this.isSubmitted.set(true))
    ).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public canDeactivate(): boolean {
    if (this.isSubmitted()) {
      return true;
    }
    
    const currentTheme = this.activeTheme();
    const savedTheme = this.userInfo()?.theme; 

    if (savedTheme && currentTheme !== savedTheme) {
      
      const confirmLeave = confirm('You have unsaved changes. Do you really want to leave?');

      if (confirmLeave) {
        this.setActiveColor(savedTheme);
        return true; 
      } else {
        return false; 
      }
    }

    return true;
  }
  
}
