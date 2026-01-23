import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseAlertType } from '../../shared/models/alert.models';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-alerts-with-actions',
  imports: [FirstUpperPipe, ButtonComponent],
  templateUrl: './alerts-with-actions.html',
  styleUrl: './alerts-with-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertsWithActions {
  public alertType = input<BaseAlertType>('default');
  public alertTitle = input<string>('Update Available');
  public alertMessage = input<string>('Default Alert Message');

  public buttonOneText = input<string>('Button One');
  public buttonTwoText = input<string>('Button Two');

  public iconAlertClass = computed(() => {
    const type = this.alertType();
    if (type === 'error') return 'alerts-with-actions--warning';
    if (type === 'default') return '';
    
    return `alerts-with-actions--${type}`;
  });

  public effectiveImgName = computed(() => {
    const useDefault = ['error', 'information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });

  public effectiveButtonVariant = computed(() => {
    return this.alertType() === 'error' ? 'destructive' : 'default';
  });
}
