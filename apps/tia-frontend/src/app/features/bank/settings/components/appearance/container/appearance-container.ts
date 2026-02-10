import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';

import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { themesConfig } from '../config/appearance.config';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { AppearanceService } from '../services/appearance-api.service';
import { TAvailableThemes } from '../models/appearance.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { selectUserInfo, selectUserLoaded } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { CanComponentDeactivate } from '../guard/unsaved-changes.guard';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { AlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appearance-container',
  imports: [
    SettingsBody,
    TranslatePipe,
    ButtonComponent,
    Skeleton,
    UiModal,
    AlertTypesWithIcons,
  ],
  providers: [AppearanceService],
  templateUrl: './appearance-container.html',
  styleUrl: './appearance-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceContainer
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  private store = inject(Store);
  private appearanceService = inject(AppearanceService);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);

  public isModalOpen = signal(false);
  private leaveDecision$ = new Subject<boolean>();

  public readonly alertKind = signal<AlertType | null>(null);
  public readonly alertMessage = signal<string>('');
  public readonly alertType = computed<AlertType | null>(() =>
    this.alertKind(),
  );
  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public toggleModal(): void {
    this.isModalOpen.update((open) => !open);
  }

  public onStay(): void {
    this.leaveDecision$.next(false);
    this.isModalOpen.set(false);
  }

  public onLeave(): void {
    const savedTheme = this.userInfo()?.theme;
    if (savedTheme) {
      this.setActiveColor(savedTheme);
    }
    this.leaveDecision$.next(true);
    this.isModalOpen.set(false);
  }

  private activeTheme = this.store.selectSignal(selectActiveTheme);
  public availableThemes = signal<TAvailableThemes | null>(null);

  public isLoading = this.appearanceService.isLoading;

  private isSubmitted = signal(false);

  private userInfo = this.store.selectSignal(selectUserInfo);
  private userLoaded = this.store.selectSignal(selectUserLoaded);

  public ngOnInit(): void {
    
    if (!this.userLoaded()) {
      this.store.dispatch(UserInfoActions.loadUser());
    }
    this.isSubmitted.set(false);
    const subscription = this.appearanceService
      .getAvailableThemes()
      .pipe(
        map((themes) => {
          return [...themes].map((theme, index) => ({
            ...theme,
            subtitle: themesConfig[index].subtitle,
          }));
        }),
        tap((themes) => {
          this.availableThemes.set(themes);
        }),
      )
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public ngOnDestroy(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
  }

  private showAlert(kind: AlertType, message: string, autoHideMs = 3500): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }

    this.alertKind.set(kind);
    this.alertMessage.set(message);

    this.alertTimeoutId = setTimeout(() => {
      this.alertKind.set(null);
      this.alertMessage.set('');
      this.alertTimeoutId = null;
    }, autoHideMs);
  }

  public isCurrentTheme(theme: string) {
    return this.activeTheme() === theme;
  }

  public onClick(selectedColor: string): void {
    this.setActiveColor(selectedColor);
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
    const subscription = this.appearanceService
      .updateUserTheme(this.activeTheme())
      .pipe(
        tap(() => {
          this.isSubmitted.set(true);
          this.showAlert(
            'success',
            this.translate.instant('settings.appearance.saveSuccess'),
          );
        }),
        catchError((error) => {
          this.showAlert(
            'error',
            this.translate.instant('settings.appearance.saveError'),
          );
          return of(null);
        }),
      )
      .subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSubmitted()) {
      return true;
    }

    const currentTheme = this.activeTheme();
    const savedTheme = this.userInfo()?.theme;

    if (savedTheme && currentTheme !== savedTheme) {
      this.isModalOpen.set(true);
      return this.leaveDecision$.asObservable();
    }

    return true;
  }
}
