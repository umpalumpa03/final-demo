import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Spinner } from '../spinner/spinner';
import { RouteLoaderVariant, RouteLoaderVariants } from '../models/route-loader.model';

@Component({
  selector: 'app-route-loader',
  standalone: true,
  imports: [Spinner],
  templateUrl: './route-loader.html',
  styleUrl: './route-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteLoader {
  variant = input<RouteLoaderVariant>(RouteLoaderVariants.TopBar);
  text = input<string>('Loading page content...');

  loaderClass = computed(() => `route-loader route-loader--${this.variant()}`);

  readonly RouteLoaderVariants = RouteLoaderVariants;
}
