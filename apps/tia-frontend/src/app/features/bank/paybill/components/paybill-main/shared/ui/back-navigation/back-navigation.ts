import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-back-navigation',
  imports: [TranslatePipe],
  templateUrl: './back-navigation.html',
  styleUrl: './back-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackNavigation {
  private readonly facade = inject(PaybillMainFacade);
  private readonly router = inject(Router);

  public readonly back = output<void>();

  protected readonly navInfo = computed(() => {
    const category = this.facade.activeCategory();
    const currentId = this.facade.selectedParentId();

    if (!category) return null;

    const providers = category.providers || [];

    if (currentId) {
      const provider = providers.find((p) => p.id === currentId);

      if (provider?.parentId) {
        const parent = providers.find((p) => p.id === provider.parentId);
        return {
          label: parent?.name || category.name,
        };
      }

      return { label: category.name };
    }

    return { label: 'Categories' };
  });

  public onBack(): void {
    const currentUrl = this.router.url.split('?')[0];
    const pathSegments = currentUrl.split('/').filter((s) => s);
    this.back.emit();

    if (pathSegments.length > 0) {
      pathSegments.pop();
      this.router.navigate(['/' + pathSegments.join('/')]);
    }
  }
}
