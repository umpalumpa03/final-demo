import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, pairwise, startWith, Subscription } from 'rxjs';
import { RouteLoader } from './shared/lib/feedback/route-loader/route-loader';
import { MonitorInactivity } from './core/auth/services/monitor-inacticity.service';
import { TokenService } from './core/auth/services/token.service';

@Component({
  imports: [RouterModule, RouteLoader],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy{
  protected title = 'tia-frontend';

  private inactivityService = inject(MonitorInactivity);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  isLoading = toSignal(
    this.router.events.pipe(
      filter(
        (e): e is NavigationStart | NavigationEnd =>
          e instanceof NavigationStart || e instanceof NavigationEnd,
      ),
      startWith(null),
      pairwise(),
      map(([prev, curr]) => {
        if (curr instanceof NavigationStart) {
          const fromRoot = this.getRootSegment(this.router.url);
          const toRoot = this.getRootSegment(curr.url);
          return fromRoot !== toRoot;
        }
        return false;
      }),
    ),
    { initialValue: false },
  );

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.translate.use(savedLanguage);

    effect(() => {
      const token = this.tokenService.accessToken;
      if (token) {
        console.log('sub')
        this.inactivityService.subscribeActivity();
      } else {
        console.log('unsub')
        this.inactivityService.unsubscribeActivity();
      }
    });
  }

  ngOnDestroy(): void {
    this.inactivityService.unsubscribeActivity();
  }

  private getRootSegment(url: string): string {
    return url.split('/')[1] || '';
  }
}
