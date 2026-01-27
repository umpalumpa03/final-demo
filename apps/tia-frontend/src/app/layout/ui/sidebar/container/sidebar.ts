import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SIDEBARDATA } from '../config/routes.config';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { SidebarService } from '../services/sidebar.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationBar, ButtonComponent, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  public readonly items = SIDEBARDATA;
  public readonly sidebarService = inject(SidebarService);
  public isCollapsed = signal(false);

  public toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  public onLogout(): void {
    this.sidebarService.signOut().subscribe((c) => console.log(c));
  }
}
