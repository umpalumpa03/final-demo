import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsHeader } from '../shared/ui/settings-header/settings-header';
import { ChangeDetectionStrategy } from '@angular/core';
import { LoanManagementStore } from '../components/loan-management/store/loan-management.store';

@Component({
  selector: 'app-settings-container',
  imports: [RouterOutlet, SettingsHeader],
  templateUrl: './settings-container.html',
  styleUrl: './settings-container.scss',
  providers: [LoanManagementStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainer {}
