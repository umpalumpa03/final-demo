import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import { BasicAlerts } from '@tia/shared/lib/alerts/components/basic-alerts/basic-alerts';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { AlertsWithActions } from '@tia/shared/lib/alerts/components/alerts-with-actions/alerts-with-actions';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { AlertStates } from '@tia/shared/lib/alerts/components/alert-states/alert-states';

@Component({
  selector: 'app-alerts',
  imports: [
    LibraryTitle,
    ShowcaseCard,
    BasicAlerts,
    AlertTypesWithIcons,
    DismissibleAlerts,
    AlertsWithActions,
    SimpleAlerts,
    AlertStates
  ],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alerts {
  public readonly pageTitle = 'Alerts & Notifications';
  public readonly pageSubtitle = 'Alert components for displaying important messages to users';
}
