import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { HORIZONTALNAVBARS } from '../../config/tabs-data';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-horizontal-nav-bar',
  imports: [NavigationBar],
  templateUrl: './horizontal-nav-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalNavBar implements OnInit {
  private translate = inject(TranslateService);

  public readonly activeHorizontal = signal<string>(this.translate.instant('storybook.navigation.sections.horizontalNavigation.dashboard'));
  public readonly horizontalItems = signal<NavigationItem[]>(HORIZONTALNAVBARS(this.translate));

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.activeHorizontal.set(this.translate.instant('storybook.navigation.sections.horizontalNavigation.dashboard'));
      this.horizontalItems.set(HORIZONTALNAVBARS(this.translate));
    });
  }
}
