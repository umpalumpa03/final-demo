import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { VERTICALNAVBARS } from '../../config/tabs-data';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  imports: [NavigationBar],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar implements OnInit {
  private translate = inject(TranslateService);

  public readonly verticalItems = signal<NavigationItem[]>(VERTICALNAVBARS(this.translate));

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.verticalItems.set(VERTICALNAVBARS(this.translate));
    });
  }
}
