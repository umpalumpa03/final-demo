import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Palette } from './model/palette.model';
import { palettesData } from '../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-palettes',
  imports: [],
  templateUrl: './palettes.html',
  styleUrl: './palettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Palettes {
  public theme = input<string>();

  public swatches = computed<Palette[]>(
    () =>
      palettesData[this.theme() as keyof typeof palettesData] ??
      palettesData.oceanblue,
  );

  public showInsideLabels = computed<boolean[]>(() =>
    this.swatches().map(
      (swatch) =>
        swatch.modifier === 'primary' || swatch.modifier === 'foreground',
    ),
  );
}
