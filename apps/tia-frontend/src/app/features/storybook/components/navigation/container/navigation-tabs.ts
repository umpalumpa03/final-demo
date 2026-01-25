import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tabs } from '../../../../../shared/lib/navigation/tabs/tabs';
import { BREADCRUMBS, BREADCRUMBS2, BREADCRUMBS3, TABS, TABS2 } from '../config/tabs-data';
import { Breadcrumbs } from '@tia/shared/lib/navigation/breadcrumbs/breadcrumbs';
import { ShowcaseCard } from "../../../shared/showcase-card/showcase-card";
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { PaginationComponent } from '../components/pagination-component/pagination-component';
import { NavBar } from "../components/nav-bar/nav-bar";
import { HorizontalNavBar } from '../components/horizontal-nav-bar/horizontal-nav-bar';
import { PillsComponent } from '../components/pills-component/pills-component';


@Component({
  selector: 'app-navigation',
  imports: [Tabs, RouterModule, Breadcrumbs, ShowcaseCard, LibraryTitle, PaginationComponent, NavBar, HorizontalNavBar, PillsComponent],
  templateUrl: './navigation-tabs.html',
  styleUrl: './navigation-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Navigation {
  public readonly tabs = signal(TABS);
  public readonly tabs2 = signal(TABS2);
  public readonly breadcrumbs = signal(BREADCRUMBS);
  public readonly breadcrumbs2 = signal(BREADCRUMBS2);
  public readonly breadcrumbs3 = signal(BREADCRUMBS3);
 
}
