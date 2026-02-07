import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Tabs } from '../../../../shared/lib/navigation/tabs/tabs';
import { getProductTabs } from '../config/products.config';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../shared/lib/primitives/button/button';
import { CommonModule } from '@angular/common';
import { filter, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-container',
  imports: [
    Tabs,
    RouterOutlet,
    TranslatePipe,
    LibraryTitle,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './products-container.html',
  styleUrl: './products-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsContainer {
  private translate = inject(TranslateService);
  private router = inject(Router);
  public readonly tabs = signal(getProductTabs(this.translate));

  private currentUrl = signal<string>('');

  public isAccountsSection = (): boolean => {
    return this.currentUrl().includes('/accounts');
  };

  public isCardsSection = (): boolean => {
    return this.currentUrl().includes('/cards');
  };

  constructor() {
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: any) => this.currentUrl.set(event.urlAfterRedirects)),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe();
  }

  get shouldShowTabs(): boolean {
    const url = this.router.url;
    return url.includes('/accounts') || url.includes('/cards/list');
  }

  public onNewItemClick(): void {
    if (this.isAccountsSection()) {
      this.router.navigate(['/bank/products/accounts/create']);
    }
  }
}
