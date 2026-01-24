import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseAlertType } from '../../shared/models/alert.models';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-alerts-with-actions',
  imports: [FirstUpperPipe, ButtonComponent],
  templateUrl: './alerts-with-actions.html',
  styleUrl: './alerts-with-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsWithActions {
  public readonly alertType = input<BaseAlertType>('default');
  public readonly alertTitle = input<string>('Update Available');
  public readonly alertMessage = input<string>('Default Alert Message');

  public readonly buttonOneText = input<string>('Button One');
  public readonly buttonTwoText = input<string>('Button Two');

  public readonly iconAlertClass = computed(() => {
    const type = this.alertType();
    if (type === 'default') return '';
    return type === 'error'
      ? 'alerts-with-actions--warning'
      : `alerts-with-actions--${type}`;
  });

  public readonly effectiveImgName = computed(() => {
    return this.alertType() === 'error' ? 'warning' : this.alertType();
  });

  public readonly effectiveButtonVariant = computed(() => {
    return this.alertType() === 'error' ? 'destructive' : 'default';
  });

  public readonly effectiveImgPath = computed(
    () => `/images/svg/alerts/base-alert-${this.effectiveImgName()}.svg`,
  );

  public readonly effectiveAltName = computed(() => `${this.alertType()} icon`);
}
