import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { BankHeaderContainer } from 'apps/tia-frontend/src/app/layout/ui/bank-header/container/bank-header-container';
import { Sidebar } from './ui/sidebar/container/sidebar';
import { MonitorInactivity } from '../core/auth/services/monitor-inacticity.service';
import { LibraryTitle } from '../features/storybook/shared/library-title/library-title';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { NavigationService } from 'apps/tia-frontend/src/app/core/services/navigation/navigation.service';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { PersonalInfoActions } from '../store/personal-info/pesronal-info.actions';

@Component({
  selector: 'app-bank-container',
  imports: [
    Sidebar,
    RouterModule,
    BankHeaderContainer,
    LibraryTitle,
    UiModal,
    RouteLoader,
  ],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankContainer {
  private monitorInactivity = inject(MonitorInactivity);
  private readonly navigationService = inject(NavigationService);

  public modalTitle = 'Inactivity Detected!';
  public subtitle = 'You will be automatically logged out in';
  public timeWarning = this.monitorInactivity.timeWarning;
  protected readonly isLoading = this.navigationService.isChangingAtSegment(2);
}
