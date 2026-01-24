import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { colorApplication } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';
import { ThemeType } from '../../../../features/admin/components/library/components/colorpalettes/model/color-palette.models';

@Component({
  selector: 'app-color-application',
  imports: [],
  templateUrl: './color-application.html',
  styleUrl: './color-application.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorApplication {
  public readonly theme = input<ThemeType>('oceanblue');
  public readonly themeLabel = input<string>();
  public readonly applications = computed(() => colorApplication[this.theme()]);
}
