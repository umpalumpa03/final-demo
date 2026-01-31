import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SETTINGS_NAV_ADMIN_CONFIG, SETTINGS_NAV_CONFIG } from '../../config/settings-header.config';

@Component({
  selector: 'app-settings-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsHeader {
  public readonly navItems = SETTINGS_NAV_CONFIG;
  public readonly adminNavItems = SETTINGS_NAV_ADMIN_CONFIG;
}
