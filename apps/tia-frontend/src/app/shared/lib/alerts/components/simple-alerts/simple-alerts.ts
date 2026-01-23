import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SimpleAlertType } from '../../shared/models/alert.models';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';

@Component({
  selector: 'app-simple-alerts',
  imports: [FirstUpperPipe],
  templateUrl: './simple-alerts.html',
  styleUrl: './simple-alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleAlerts {
  public alertType = input<SimpleAlertType>('information');
  public alertMessage = input<string>('This is a simple informational message without a title.');

  public iconAlertClass = computed(() => `simple-alerts--${this.alertType()}`);

  public effectiveImgName = computed(() => {
    return this.alertType() === 'information' ? 'default' : this.alertType();
  });
}
