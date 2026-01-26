import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsHeader } from '../shared/ui/settings-header/settings-header';

@Component({
  selector: 'app-settings-container',
  imports: [RouterOutlet, SettingsHeader],
  templateUrl: './settings-container.html',
  styleUrl: './settings-container.scss',
})
export class SettingsContainer {}
