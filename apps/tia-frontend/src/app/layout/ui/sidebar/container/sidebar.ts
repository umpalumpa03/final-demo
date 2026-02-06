import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  DestroyRef,
  ElementRef,
  effect,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, filter, finalize, tap } from 'rxjs';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { getSidebarItems } from '../config/routes.config';
import { AlertsWithActions } from '@tia/shared/lib/alerts/components/alerts-with-actions/alerts-with-actions';
import { BreakpointService } from '../../../../core/services/breakpoints/breakpoint.service';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { userInfoFeature } from 'apps/tia-frontend/src/app/store/user-info/user-info.reducer';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    NavigationBar,
    ButtonComponent,
    TranslatePipe,
    AlertsWithActions,
    RouteLoader,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly breakpointService = inject(BreakpointService);
  private readonly store = inject(Store);

  public readonly isMobile = this.breakpointService.isMobile;
  public readonly isTablet = this.breakpointService.isTablet;
  public readonly isCollapsed = signal(false);
  public readonly isDropdownOpen = signal(false);
  public readonly items = signal<NavigationItem[]>([]);
  public readonly showLogoutConfirm = signal(false);
  public readonly isLoggingOut = signal(false);

  private readonly role = toSignal(
    this.store.select(userInfoFeature.selectRole),
  );

  constructor() {
    this.setupBreakpointEffect();
    this.setupClickOutsideListener();
    this.setupRoleEffect();
  }

  ngOnInit(): void {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateItems());
  }

  private setupBreakpointEffect(): void {
    effect(() => {
      if (this.isMobile()) {
        this.isCollapsed.set(false);
        this.isDropdownOpen.set(false);
      } else {
        this.isCollapsed.set(this.isTablet());
      }
    });
  }

  private setupRoleEffect(): void {
    effect(() => {
      this.role();
      this.updateItems();
    });
  }

  private setupClickOutsideListener(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isMobile() && this.isDropdownOpen()),
        filter(
          (event) =>
            !this.elementRef.nativeElement.contains(event.target as Node),
        ),
        tap(() => this.isDropdownOpen.set(false)),
      )
      .subscribe();
  }

  private updateItems(): void {
    const items = getSidebarItems(this.translate);

    if (this.role() === 'SUPPORT') {
      items.push({
        label: this.translate.instant('sidebar.sidebar.storybook'),
        icon: 'images/svg/sidebar-nav/storybook.svg',
        route: '../storybook',
      });
    }

    this.items.set(items);
  }

  public toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  public toggleDropdown(): void {
    this.isDropdownOpen.update((v) => !v);
  }

  public closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  public onLogout(): void {
    this.showLogoutConfirm.set(true);
    this.closeDropdown();
  }

  public cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  public confirmLogout(): void {
    this.isLoggingOut.set(true);

    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.isLoggingOut.set(false);
          this.showLogoutConfirm.set(false);
        }),
      )
      .subscribe();
  }
}
