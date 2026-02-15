import { inject, Injectable, signal } from '@angular/core';
import {
  Event as RouterEvent,
  GuardsCheckEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  shareReplay,
  startWith,
  tap,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);
  public readonly isFeatureLoading = this.isChangingAtSegment(1);
  private readonly suppressNext = signal(false);

  public suppressNextLoader(): void {
    this.suppressNext.set(true);
  }

  public isChangingAtSegment(index: number) {
    const navEvents$ = this.router.events.pipe(shareReplay(1));

    const start$ = navEvents$.pipe(
      filter(
        (e: RouterEvent): e is GuardsCheckEnd => e instanceof GuardsCheckEnd,
      ),
      map((e) => {
        if (!e.shouldActivate) {
          return false;
        }

        if (this.suppressNext()) {
          this.suppressNext.set(false);
          return false;
        }

        const currentSeg = this.getSegmentAt(this.router.url, index);
        const targetSeg = this.getSegmentAt(e.urlAfterRedirects, index);
        return currentSeg !== targetSeg;
      }),
      filter(Boolean),
      map(() => true),
    );

    const stop$ = navEvents$.pipe(
      filter(
        (e: RouterEvent) =>
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError,
      ),
      map(() => false),
    );

    return toSignal(
      merge(start$, stop$).pipe(startWith(false), distinctUntilChanged()),
      { initialValue: false },
    );
  }

  private getSegmentAt(url: string, index: number): string {
    const pathOnly = url.split(/[?#]/)[0];
    const segments = pathOnly.split('/').filter((s) => s.length > 0);
    return segments[index - 1] || '';
  }
}
