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
import { catchError, Observable, of, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { selectActiveTheme } from 'apps/tia-frontend/src/app/store/theme/theme.selectors';
import { ThemeActions } from 'apps/tia-frontend/src/app/store/theme/theme.actions';
import { AppearanceService } from '../services/appearance-api.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { selectUserTheme } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { CanComponentDeactivate } from '../guard/unsaved-changes.guard';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AppearanceStore } from '../store/appearance.store';
import { NavigationService } from 'apps/tia-frontend/src/app/core/services/navigation/navigation.service';
import { BasicCard } from "@tia/shared/lib/cards/basic-card/basic-card";

@Component({
  selector: 'app-appearance-container',
  imports: [SettingsBody, TranslatePipe, ButtonComponent, Skeleton, UiModal, BasicCard],
  providers: [AppearanceService],
  templateUrl: './appearance-container.html',
  styleUrl: './appearance-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceContainer implements OnInit, CanComponentDeactivate {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly alertService = inject(AlertService);
  private readonly appearanceStore = inject(AppearanceStore);
  private readonly navigationService = inject(NavigationService);

  public readonly isFetching = this.appearanceStore.isRefreshing;
  public readonly isLoading = this.appearanceStore.isLoading;
  public readonly hasLoaded = this.appearanceStore.hasLoaded;
  public readonly availableThemes = this.appearanceStore.themes;

  public readonly isMobile = this.breakpointService.isMobile;

  public isModalOpen = signal(false);
  private leaveDecision$ = new Subject<boolean>();

  public toggleModal(): void {
    this.isModalOpen.update((open) => !open);
  }

  public onStay(): void {
    this.leaveDecision$.next(false);
    this.isModalOpen.set(false);
  }

  public onLeave(): void {
    const savedTheme = this.userTheme();
    if (savedTheme) {
      this.setActiveColor(savedTheme);
    }
    this.navigationService.suppressNextLoader();
    this.leaveDecision$.next(true);
    this.isModalOpen.set(false);
  }

  private activeTheme = this.store.selectSignal(selectActiveTheme);

  private isSubmitted = signal(false);

  private userTheme = this.store.selectSignal(selectUserTheme);

  public ngOnInit(): void {
    this.isSubmitted.set(false);

    this.appearanceStore.fetchThemes({});
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
    this.appearanceStore
      .updateTheme(this.activeTheme())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.isSubmitted.set(true);
          this.alertService.success(
            this.translate.instant('settings.appearance.saveSuccess'),
          );
          this.store.dispatch(
            UserInfoActions.loadUserTheme({ theme: this.activeTheme() }),
          );
        }),
        catchError(() => {
          this.alertService.error(
            this.translate.instant('settings.appearance.saveError'),
          );
          return of(null);
        }),
      )
      .subscribe();
  }

  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSubmitted()) {
      return true;
    }

    const currentTheme = this.activeTheme();
    const savedTheme = this.userTheme();

    if (savedTheme && currentTheme !== savedTheme) {
      this.navigationService.suppressNextLoader();
      this.isModalOpen.set(true);
      return this.leaveDecision$.asObservable();
    }

    return true;
  }
}
