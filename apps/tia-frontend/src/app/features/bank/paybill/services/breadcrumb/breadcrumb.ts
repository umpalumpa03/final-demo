import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaybillMainFacade } from '../../components/paybill-main/services/paybill-main-facade';

export interface PaybillBreadcrumb {
  label: string;
  icon?: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly facade = inject(PaybillMainFacade);

  private readonly technicalPages = [
    'otp-verification',
    'payment-success',
    'confirm-payment',
  ];

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

    // if (this.technicalPages.some((page) => fullUrl.includes(page))) return [];
    // es iyos aq megobrebo

    const breadcrumbs: PaybillBreadcrumb[] = [
      { label: 'Paybill', route: '/bank/paybill/pay' },
    ];

    if (fullUrl.includes('/templates')) {
      breadcrumbs.push({
        label: 'Templates',
        route: '/bank/paybill/templates',
      });
      return breadcrumbs;
    }

    const anchor = '/paybill/pay/';
    if (!fullUrl.includes(anchor)) return breadcrumbs;

    const pathAfterPay = fullUrl.split(anchor)[1];
    const segments = pathAfterPay.split('/').filter((s) => s.length > 0);

    let accumulatedPath = '/bank/paybill/pay';

    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;

      const isLast = index === segments.length - 1;

      const label = this.resolveLabelFromAnywhere(segment, isLast);

      breadcrumbs.push({
        label,
        route: accumulatedPath,
      });
    });

    return breadcrumbs;
  }

  private resolveLabelFromAnywhere(id: string, isLast: boolean): string {
    const category = this.facade
      .categories()
      .find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (category) return category.name;

    if (!isLast) {
      const providers = this.facade.activeCategory()?.providers || [];
      const provider = providers.find(
        (p) => p.id.toLowerCase() === id.toLowerCase(),
      );
      if (provider) return provider.name!;
    }

    return id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
