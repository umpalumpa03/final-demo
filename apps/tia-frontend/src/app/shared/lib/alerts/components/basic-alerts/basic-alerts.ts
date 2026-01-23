import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseAlertType } from '../../shared/models/alert.models';
const DEFAULT_MESSAGE = 'This is a default alert with important information.';

@Component({
  selector: 'app-basic-alerts',
  imports: [],
  templateUrl: './basic-alerts.html',
  styleUrl: './basic-alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicAlerts {

  public alertType = input<BaseAlertType>('default');
  public alertTitle = input<string>('Default Alert');
  public readonly alertMessage = input<string>(DEFAULT_MESSAGE);

  public alertClass = computed(() => `basic-alert--${this.alertType()}`);

  public effectiveTitle = computed(() => {
    if (this.alertType() === 'error' && this.alertTitle() === 'Default Alert') {
      return 'Error Alert';
    }
    return this.alertTitle();
  });

  public effectiveMessage = computed(() => {
    if (this.alertType() === 'error' && this.alertMessage() === DEFAULT_MESSAGE) {
      return 'This is an error alert with important information.';
    }
    return this.alertMessage();
  });
}
