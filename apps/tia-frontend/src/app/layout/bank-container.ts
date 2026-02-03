import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BankHeaderContainer } from 'apps/tia-frontend/src/app/layout/ui/bank-header/container/bank-header-container';
import { Sidebar } from './ui/sidebar/container/sidebar';
import { NavigationService } from 'apps/tia-frontend/src/app/core/services/navigation/navigation.service';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-bank-container',
  imports: [Sidebar, RouterModule, BankHeaderContainer, RouteLoader],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankContainer {
  private readonly navigationService = inject(NavigationService);
  protected readonly isLoading = this.navigationService.isChangingAtSegment(2);
}
