import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getColorApplication } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/config/palette-data.config';
import { ThemeType } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/model/color-palette.models';

@Component({
  selector: 'app-color-application',
  imports: [],
  templateUrl: './color-application.html',
  styleUrl: './color-application.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorApplication {
  private readonly translate = inject(TranslateService);
  public readonly theme = input<ThemeType>('oceanblue');
  public readonly themeLabel = input<string>();
  public readonly applications = computed(() => {
    const colorApplication = getColorApplication(this.translate);
    return colorApplication[this.theme() as keyof typeof colorApplication];
  });
}
