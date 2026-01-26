import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-settings-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
})
export class SettingsHeader {}
