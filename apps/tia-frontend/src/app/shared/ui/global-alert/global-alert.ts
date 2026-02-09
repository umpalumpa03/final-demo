import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({
  selector: 'app-global-alert',
  imports: [AlertTypesWithIcons, DismissibleAlerts],
  templateUrl: './global-alert.html',
  styleUrl: './global-alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalAlert {
  protected readonly alertService = inject(AlertService);
}
