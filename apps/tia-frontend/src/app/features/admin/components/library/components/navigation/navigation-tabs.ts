import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tabs } from '../../../../../../shared/lib/navigation/tabs/tabs';
import { BREADCRUMBS, BREADCRUMBS2, BREADCRUMBS3, TABS, TABS2 } from './config/tabs-data';
import { Breadcrumbs } from '@tia/shared/lib/navigation/breadcrumbs/breadcrumbs';
import { ShowcaseCard } from "../../shared/showcase-card/showcase-card";
import { LibraryTitle } from '../../shared/library-title/library-title';


@Component({
  selector: 'app-navigation',
  imports: [Tabs, RouterModule, Breadcrumbs, ShowcaseCard, LibraryTitle],
  templateUrl: './navigation-tabs.html',
  styleUrl: './navigation-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Navigation {
  public tabs = signal(TABS);
  public tabs2 = signal(TABS2);
  public breadcrumbs = signal(BREADCRUMBS);
  public breadcrumbs2 = signal(BREADCRUMBS2);
  public breadcrumbs3 = signal(BREADCRUMBS3);
}
