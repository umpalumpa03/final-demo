import { inject, Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, pairwise, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);
  public readonly isFeatureLoading = this.isChangingAtSegment(1);

  public isChangingAtSegment(index: number) {
    return toSignal(
      this.router.events.pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        startWith(null),
        pairwise(),
        map(([prev, curr]) => {
          if (curr instanceof NavigationStart) {
            const currentSeg = this.getSegmentAt(this.router.url, index);
            const targetSeg = this.getSegmentAt(curr.url, index);
            return currentSeg !== targetSeg;
          }
          return false;
        }),
      ),
      { initialValue: false },
    );
  }

  private getSegmentAt(url: string, index: number): string {
    const pathOnly = url.split(/[?#]/)[0];
    const segments = pathOnly.split('/').filter((s) => s.length > 0);
    return segments[index - 1] || '';
  }
}
