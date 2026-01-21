import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FirstUpperPipe } from '../../../../pipes/first-upper/first-upper-pipe';
import { AlertType } from '../../shared/models/alert.models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert-types-with-icons',
  imports: [FirstUpperPipe, NgClass],
  templateUrl: './alert-types-with-icons.html',
  styleUrl: './alert-types-with-icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertTypesWithIcons {
  public alertType = input<AlertType>('information');
  public alertMessage = input<string>('Default Alert Message');

  public effectiveImgName = computed(() => {
    const useDefault = ['error', 'information'].includes(this.alertType());
    return useDefault ? 'default' : this.alertType();
  });

}
