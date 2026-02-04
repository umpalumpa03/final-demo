import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseAlertType } from '../../shared/models/alert.models';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';

@Component({
  selector: 'app-alerts-with-actions',
  imports: [FirstUpperPipe],
  templateUrl: './alerts-with-actions.html',
  styleUrl: './alerts-with-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsWithActions {
  public readonly alertType = input<BaseAlertType>('default');
  public readonly alertTitle = input<string>('Update Available');
  public readonly alertMessage = input<string>('Default Alert Message');
  public readonly customMaxwidth = input<string>('105.3rem');

  public readonly iconAlertClass = computed(() => {
    const type = this.alertType();
    if (type === 'default') return '';
    return type === 'error'
      ? 'alerts-actions--warning'
      : `alerts-actions--${type}`;
  });

  public readonly effectiveImgName = computed(() => {
    return this.alertType() === 'error' ? 'warning' : this.alertType();
  });

  public readonly effectiveImgPath = computed(
    () => `/images/svg/alerts/base-alert-${this.effectiveImgName()}.svg`,
  );

  public readonly effectiveAltName = computed(() => `${this.alertType()} icon`);
}
