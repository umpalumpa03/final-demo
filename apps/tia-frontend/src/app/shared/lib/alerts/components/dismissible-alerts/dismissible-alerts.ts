import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AlertType } from '../../shared/models/alert.models';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';

@Component({
  selector: 'app-dismissible-alerts',
  imports: [FirstUpperPipe],
  templateUrl: './dismissible-alerts.html',
  styleUrl: './dismissible-alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DismissibleAlerts {
  public alertType = input<AlertType>('information');
  public alertMessage = input<string>('Default Alert Message');

  public iconAlertClass = computed(() => `dismissible-alerts--${this.alertType()}`);

  public isDismissed = signal<boolean>(false)

  public effectiveImgName = computed(() => {
    const useDefault = ['error', 'information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });

  public onDismiss():void {
    this.isDismissed.set(true)
  }
}
