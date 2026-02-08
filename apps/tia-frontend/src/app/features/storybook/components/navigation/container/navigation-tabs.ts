import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-navigation',
  imports: [Tabs, RouterModule, Breadcrumbs, ShowcaseCard, LibraryTitle, PaginationComponent, NavBar, HorizontalNavBar, PillsComponent, TranslatePipe],
  templateUrl: './navigation-tabs.html',
  styleUrl: './navigation-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Navigation implements OnInit {
  private translate = inject(TranslateService);

  public readonly tabs = signal(TABS(this.translate));
  public readonly tabs2 = signal(TABS2(this.translate));
  public readonly breadcrumbs = signal(BREADCRUMBS(this.translate));
  public readonly breadcrumbs2 = signal(BREADCRUMBS2(this.translate));
  public readonly breadcrumbs3 = signal(BREADCRUMBS3(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.tabs.set(TABS(this.translate));
      this.tabs2.set(TABS2(this.translate));
      this.breadcrumbs.set(BREADCRUMBS(this.translate));
      this.breadcrumbs2.set(BREADCRUMBS2(this.translate));
      this.breadcrumbs3.set(BREADCRUMBS3(this.translate));
    });
  }

}
