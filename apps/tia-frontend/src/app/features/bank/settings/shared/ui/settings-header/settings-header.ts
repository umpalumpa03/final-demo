import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsHeader {}
