import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { getSidebarItems } from '../config/routes.config';
import { AlertsWithActions } from '@tia/shared/lib/alerts/components/alerts-with-actions/alerts-with-actions';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationBar, ButtonComponent, TranslatePipe, AlertsWithActions],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  private readonly TABLET_BREAKPOINT = 1024;

  public isCollapsed = signal(false);
  public items = signal<NavigationItem[]>([]);
  public showLogoutConfirm = signal(false);

  ngOnInit(): void {
    this.updateItems();
    this.checkScreenSize();

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateItems());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isCollapsed.set(window.innerWidth <= this.TABLET_BREAKPOINT);
  }

  private updateItems(): void {
    this.items.set(getSidebarItems(this.translate));
  }

  public toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  public onLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  public cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  public confirmLogout(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout().subscribe();
  }
}
