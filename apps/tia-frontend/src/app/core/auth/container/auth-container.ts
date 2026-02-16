import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { updateSidePanelForRoute } from '../utils/resolve-panel-data';
import { AuthService } from '../services/auth.service';
import { IFeature } from '../models/auth.models';
import { SidePanel } from '../shared/side-panel/side-panel';
import { tap } from 'rxjs';
import { LanguageSwitcher } from '../../../features/bank/settings/components/language/components/language-switcher/language-switcher';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ɵɵRouterLink } from "@angular/router/testing";

@Component({
  selector: 'app-auth-container',
  imports: [RouterOutlet, SidePanel, LanguageSwitcher, RouteLoader, ɵɵRouterLink],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainer implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  public isLoading = computed(() => this.authService.isLoginLoading());
  public currentRoute = signal<string>('');

  public sidePanelData = signal<IFeature | null>(null);

  public ngOnInit(): void {
    updateSidePanelForRoute(this.router.url, this.sidePanelData);

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res instanceof NavigationEnd) {
            updateSidePanelForRoute(res.url, this.sidePanelData);
            this.currentRoute.set(res.url);
          }
        }),
      )
      .subscribe();
  }
}
