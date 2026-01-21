import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { baseAlertType } from '../../shared/models/alert.models';

@Component({
  selector: 'app-basic-alerts',
  imports: [],
  templateUrl: './basic-alerts.html',
  styleUrl: './basic-alerts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicAlerts {
  public alertType = input<baseAlertType>('default');
  public alertTitle = input<string>('Default Alert');
  public alertMessage = input<string>('This is a default alert with important information.');

 public effectiveTitle = computed(() => {
    if(this.alertType() === 'error' && this.alertTitle() === 'Default Alert') {
      return 'Error Alert';
    }
    return this.alertTitle();
  });

  public effectiveMessage = computed(() => { 
    if(this.alertType() === 'error' && this.alertMessage() === 'This is a default alert with important information.') {
      return 'This is an error alert with important information.';
    }
    return this.alertMessage();
  });
}
