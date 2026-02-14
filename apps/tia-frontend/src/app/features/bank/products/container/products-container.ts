import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Tabs } from '../../../../shared/lib/navigation/tabs/tabs';
import { getProductTabs } from '../config/products.config';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

@Component({
  selector: 'app-products-container',
  imports: [Tabs, RouterOutlet, TranslatePipe, LibraryTitle],
  templateUrl: './products-container.html',
  styleUrl: './products-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsContainer {
  private translate = inject(TranslateService);
  private router = inject(Router);
  public readonly tabs = signal(getProductTabs(this.translate));

  get shouldShowTabs(): boolean {
    const url = this.router.url;
    return url.includes('/accounts') || url.includes('/cards/list');
  }
}
