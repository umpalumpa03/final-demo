import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  AlertStateType,
} from '../../shared/models/alert.models';

@Component({
  selector: 'app-alert-states',
  imports: [],
  templateUrl: './alert-states.html',
  styleUrl: './alert-states.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertStates {
  public readonly alertState = input<AlertStateType>('default');
  public readonly alertTitle = input<string>('Default Alert');
  public readonly alertMessage = input<string>(
    'This is a default alert with important information.'
  );

  public readonly effectiveAlertState = computed(
    () => `alert-states--${this.alertState()}`
  );
}
