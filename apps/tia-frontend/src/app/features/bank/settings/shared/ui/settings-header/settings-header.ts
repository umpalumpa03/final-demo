import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import {
  SETTINGS_NAV_ADMIN_CONFIG,
  SETTINGS_NAV_CONFIG,
} from '../../config/settings-header.config';
import { selectUserRole } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';

@Component({
  selector: 'app-settings-header',
  imports: [TranslatePipe, Tabs],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsHeader {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private updateNavItems(): void {
    this.navItems.set(
      SETTINGS_NAV_CONFIG.map((item) => ({
        label: this.translate.instant(item.translateString),
        route: item.routerLink,
        icon: item.src,
      })),
    );

    this.adminNavItems.set(
      SETTINGS_NAV_ADMIN_CONFIG.map((item) => ({
        label: this.translate.instant(item.translateString),
        route: item.routerLink,
        icon: item.src,
      })),
    );
  }

  public ngOnInit(): void {
    this.updateNavItems();

    this.translate.onLangChange
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.updateNavItems()),
      )
      .subscribe();

    this.translate.onTranslationChange
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.updateNavItems()),
      )
      .subscribe();
  }

  public readonly navItems = signal<
    { label: string; route: string; icon: string }[]
  >([]);
  public readonly adminNavItems = signal<
    { label: string; route: string; icon: string }[]
  >([]);

  private readonly userRole = this.store.selectSignal(selectUserRole);

  public readonly isAdmin = computed(() => this.userRole() === 'SUPPORT');
}
