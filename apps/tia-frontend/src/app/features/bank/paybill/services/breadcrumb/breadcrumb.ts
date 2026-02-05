import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface PaybillBreadcrumb {
  label: string;
  icon?: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);

  public readonly breadcrumbs$ = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getDynamicBreadcrumbs()),
      startWith(this.getDynamicBreadcrumbs()),
    ),
    { initialValue: [] as PaybillBreadcrumb[] },
  );

  public getDynamicBreadcrumbs(): PaybillBreadcrumb[] {
    const fullUrl = this.router.url.split('?')[0];
    const anchor = '/paybill';
    const anchorIndex = fullUrl.indexOf(anchor);

    const breadcrumbs: PaybillBreadcrumb[] = [
      { label: 'Paybill', route: '/bank/paybill/pay' },
    ];

    if (anchorIndex === -1) return breadcrumbs;

    const pathAfterAnchor = fullUrl.substring(anchorIndex + anchor.length);
    const segments = pathAfterAnchor.split('/').filter((s) => s.length > 0);

    let accumulatedPath = fullUrl.substring(0, anchorIndex + anchor.length);

    segments.forEach((segment) => {
      if (segment.toLowerCase() === 'pay') {
        accumulatedPath += `/${segment}`;
        return;
      }

      const subSegments = segment.split('-');

      subSegments.forEach((sub, index) => {
        if (index === 0) {
          accumulatedPath += `/${segment}`;
        }

        breadcrumbs.push({
          label: this.capitalize(sub),
          route: accumulatedPath,
        });
      });
    });

    return breadcrumbs;
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
