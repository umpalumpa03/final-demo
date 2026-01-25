import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { colorApplication } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/config/palette-data.config';
import { ThemeType } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/model/color-palette.models';

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
