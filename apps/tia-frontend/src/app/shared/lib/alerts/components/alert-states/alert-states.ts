import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  AlertStateType,
  BaseAlertType,
} from '../../shared/models/alert.models';

@Component({
  selector: 'app-alert-states',
  imports: [],
  templateUrl: './alert-states.html',
  styleUrl: './alert-states.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertStates {
  public alertType = input<BaseAlertType>('default');
  public alertState = input<AlertStateType>('default');

  public alertTitle = input<string>('Default Alert');
  public alertMessage = input<string>(
    'This is a default alert with important information.',
  );

  public effectiveAlertState = computed(
    () => `alert-states--${this.alertState()}`,
  );
}
