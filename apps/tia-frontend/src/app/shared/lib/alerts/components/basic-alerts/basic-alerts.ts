import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseAlertType } from '../../shared/models/alert.models';

@Component({
  selector: 'app-basic-alerts',
  imports: [],
  templateUrl: './basic-alerts.html',
  styleUrl: './basic-alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicAlerts {
  public readonly alertType = input<BaseAlertType>('default');
  public readonly alertTitle = input<string>('Default Alert');
  public readonly alertMessage = input<string>(
    'This is a default alert with important information.',
  );

  public readonly alertClass = computed(() => `basic-alert--${this.alertType()}`);

  public readonly effectiveTitle = computed(() => {
    const isDefault = this.alertTitle() === 'Default Alert';
    return (this.alertType() === 'error' && isDefault) 
      ? 'Error Alert' 
      : this.alertTitle();
  });

  public readonly effectiveMessage = computed(() => {
    if (this.alertType() === 'error' && this.alertMessage() === 'This is a default alert with important information.') {
      return 'This is an error alert with important information.';
    }
    return this.alertMessage();
  });

  public readonly effectiveImgPath = computed(
    () => `/images/svg/alerts/base-alert-${this.alertType()}.svg`,
  );

  public readonly effectiveAltName = computed(
    () => `${this.alertType()} icon`
  );
}
