import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorSwitch } from '@tia/shared/lib/color-switching-buttons/color-switch/color-switch';
import { COLOR_SWITCH_DATA } from './config/color-switch-data';
import { ColorSwitchType } from './model/color-switch.model';

@Component({
  selector: 'app-library-header',
  imports: [ColorSwitch],
  templateUrl: './library-header.html',
  styleUrl: './library-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryHeader {
  public colorConfigs: ColorSwitchType[] = COLOR_SWITCH_DATA;
}
