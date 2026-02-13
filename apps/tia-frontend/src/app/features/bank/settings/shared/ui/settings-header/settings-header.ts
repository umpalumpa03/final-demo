import { Component, computed, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  SETTINGS_NAV_ADMIN_CONFIG,
  SETTINGS_NAV_CONFIG,
} from '../../config/settings-header.config';
import { Store } from '@ngrx/store';
import { selectUserRole } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { Tabs } from "@tia/shared/lib/navigation/tabs/tabs";

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

  public readonly navItems = SETTINGS_NAV_CONFIG.map((item) => ({
    label: this.translate.instant(item.translateString),
    route: item.routerLink,
    icon: item.src,
  }));

  public readonly adminNavItems = SETTINGS_NAV_ADMIN_CONFIG.map((item) => ({
    label: this.translate.instant(item.translateString),
    route: item.routerLink,
    icon: item.src,
  }));

  private readonly userRole = this.store.selectSignal(selectUserRole);

  public readonly isAdmin = computed(() => this.userRole() === 'SUPPORT');
}
