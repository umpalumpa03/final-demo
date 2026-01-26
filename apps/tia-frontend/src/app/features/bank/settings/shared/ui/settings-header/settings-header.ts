import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsHeader {}
