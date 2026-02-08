import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Palette } from './model/palette.model';
import { getPalettesData } from '../../../features/storybook/components/colorpalettes/config/palette-data.config';
@Component({
  selector: 'app-palettes',
  imports: [],
  templateUrl: './palettes.html',
  styleUrl: './palettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Palettes {
  private readonly translate = inject(TranslateService);
  public theme = input<string>();

  public swatches = computed<Palette[]>(() => {
    const palettesData = getPalettesData(this.translate);
    return (
      palettesData[this.theme() as keyof typeof palettesData] ??
      palettesData.oceanblue
    );
  });

  public showInsideLabels = computed<boolean[]>(() =>
    this.swatches().map(
      (swatch) =>
        swatch.modifier === 'primary' || swatch.modifier === 'foreground',
    ),
  );
}
