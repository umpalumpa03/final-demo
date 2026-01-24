import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  viewChildren,
  ViewChildren,
} from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import { BasicAlerts } from '@tia/shared/lib/alerts/components/basic-alerts/basic-alerts';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { AlertsWithActions } from '@tia/shared/lib/alerts/components/alerts-with-actions/alerts-with-actions';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import {
  ALERTS_ACTIONS_DATA,
  ALERTS_BASIC_DATA,
  ALERTS_CONFIG,
  ALERTS_DISMISSIBLE_DATA,
  ALERTS_ICONS_DATA,
  ALERTS_SIMPLE_DATA,
  ALERTS_STATES_DATA,
  ALERTS_TITLES,
} from '../config/alerts-data.config';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

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
    ButtonComponent,
  ],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alerts {
  public readonly pageTitle: string = 'Alerts & Notifications';
  public readonly pageSubtitle: string =
    'Alert components for displaying important messages to users';

  public readonly titles = ALERTS_TITLES;

  public readonly alertSections = ALERTS_CONFIG;

  public readonly alertBasicData = ALERTS_BASIC_DATA;

  public readonly alertIconsData = ALERTS_ICONS_DATA;

  public readonly alertDismissibleData = ALERTS_DISMISSIBLE_DATA;

  public readonly alertActionsData = ALERTS_ACTIONS_DATA;

  public readonly alertSimpleData = ALERTS_SIMPLE_DATA;

  public readonly alertStateData = ALERTS_STATES_DATA;

  readonly alertComponents = viewChildren(DismissibleAlerts);

  public onResetAll(): void {
    this.alertComponents().forEach((alert) => {
      alert.isDismissed.set(false);
    });
  }

  public effectiveTitle(section: string): string {
    return section === this.titles.DISMISSIBLE ? '' : section;
  }
}
