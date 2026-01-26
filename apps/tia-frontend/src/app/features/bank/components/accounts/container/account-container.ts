import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TABS } from '../config/account.config';

@Component({
  selector: 'app-account-container',
  imports: [Tabs, RouterOutlet],
  templateUrl: './account-container.html',
  styleUrl: './account-container.scss',
})
export class AccountContainer {
  public readonly tabs = signal(TABS);

}
