
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TABS } from '../config/products.config';


@Component({
  selector: 'app-products-container',
  imports: [Tabs, RouterOutlet],
  templateUrl: './products-container.html',
  styleUrl: './products-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsContainer {
  public readonly tabs = signal(TABS);

}
