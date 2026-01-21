import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FirstUpperPipe } from '../../../pipes/first-upper/first-upper-pipe';
export type AlertType = 'information' | 'success' | 'error' | 'warning';

@Component({
  selector: 'app-alert-types-with-icons',
  imports: [FirstUpperPipe],
  templateUrl: './alert-types-with-icons.html',
  styleUrl: './alert-types-with-icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertTypesWithIcons {
  alertType = input<AlertType>('information');
  alertMessage = input<string>('Default Alert Message');

  effectiveImgName = computed(() => {
    const useDefault = ['error', 'information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });
}
