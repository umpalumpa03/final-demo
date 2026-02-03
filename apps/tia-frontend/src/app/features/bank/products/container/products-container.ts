import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { getProductTabs } from '../config/products.config';

@Component({
  selector: 'app-products-container',
  imports: [Tabs, RouterOutlet],
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
