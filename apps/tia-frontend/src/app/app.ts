import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, pairwise, startWith } from 'rxjs';
import { RouteLoader } from './shared/lib/feedback/route-loader/route-loader';

@Component({
  imports: [RouterModule, RouteLoader],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected title = 'tia-frontend';

  private translate = inject(TranslateService);
  private router = inject(Router);

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
  }

  private getRootSegment(url: string): string {
    return url.split('/')[1] || '';
  }
}
