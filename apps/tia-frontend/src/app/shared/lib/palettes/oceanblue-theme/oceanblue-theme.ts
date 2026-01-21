import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Palette } from '../model/palette.model';
import { OCEANBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-oceanblue-theme',
  imports: [],
  templateUrl: './oceanblue-theme.html',
  styleUrl: './oceanblue-theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OceanblueTheme {
  public readonly swatches: Palette[] = OCEANBLUE_PALETTE_DATA;
}
