import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Spinner } from '../spinner/spinner';
import { RouteLoaderVariant, RouteLoaderVariants } from '../models/route-loader.model';

@Component({
  selector: 'app-route-loader',
  imports: [Spinner],
  templateUrl: './route-loader.html',
  styleUrl: './route-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteLoader {
  public readonly variant = input<RouteLoaderVariant>(RouteLoaderVariants.TopBar);
  public readonly text = input<string>('Loading page content...');
  public readonly fillContainer = input<boolean>(false);

  public readonly loaderClass = computed(() => {
    const baseClass = `route-loader route-loader--${this.variant()}`;
    return this.fillContainer() ? `${baseClass} route-loader--fill-container` : baseClass;
  });

  protected readonly RouteLoaderVariants = RouteLoaderVariants;
}
