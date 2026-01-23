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
  public readonly alertType = input<AlertType>('information');
  public alertMessage = input<string>('Default Alert Message');

  public readonly iconAlertClass = computed(() => `dismissible-alerts--${this.alertType()}`);

  public readonly isDismissed = signal<boolean>(false)

  public readonly effectiveImgName = computed(() => {
    const useDefault = ['information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });

  public readonly effectiveImgPath = computed(
    () => `/images/svg/alerts/base-alert-${this.effectiveImgName()}.svg`,
  );

  public readonly effectiveAltName = computed(
    () => `${this.alertType()} icon`
  );

  public onDismiss():void {
    this.isDismissed.set(true)
  }
  
}
