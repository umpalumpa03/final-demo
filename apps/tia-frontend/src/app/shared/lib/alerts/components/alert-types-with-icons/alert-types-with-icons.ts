import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FirstUpperPipe } from '@tia/shared/pipes/first-upper/first-upper-pipe';
import { AlertType } from '../../shared/models/alert.models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-types-with-icons',
  imports: [FirstUpperPipe, TranslatePipe],
  templateUrl: './alert-types-with-icons.html',
  styleUrl: './alert-types-with-icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertTypesWithIcons {
  public readonly alertType = input<AlertType>('information');
  public readonly alertMessage = input<string>('Default Alert Message');
  public readonly customMaxwidth = input<string>('105.3rem');
  
  public readonly iconAlertClass = computed(() => `alert-icons--${this.alertType()}`);

  public readonly translationKey = computed(() => `common.alertMessages.${this.alertType()}`);

  public readonly effectiveImgName = computed(() => {
    const useDefault = ['error', 'information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });

  public readonly effectiveImgPath = computed(
    () => `/images/svg/alerts/base-alert-${this.effectiveImgName()}.svg`,
  );

  public readonly effectiveAltName = computed(
    () => `${this.alertType()} icon`
  );
}
