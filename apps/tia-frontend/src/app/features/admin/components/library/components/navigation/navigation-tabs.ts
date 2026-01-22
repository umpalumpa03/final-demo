import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tabs } from '../../../../../../shared/lib/navigation/tabs/tabs';
import { TABS, TABS2 } from './config/tabs-data';


@Component({
  selector: 'app-navigation',
  imports: [Tabs, RouterModule],
  templateUrl: './navigation-tabs.html',
  styleUrl: './navigation-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Navigation {
  public tabs = signal(TABS);
  public tabs2 = signal(TABS2);
}
