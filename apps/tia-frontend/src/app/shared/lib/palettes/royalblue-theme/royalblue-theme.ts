import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Palette } from '../model/palette.model';
import { ROYALBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-royalblue-theme',
  imports: [],
  templateUrl: './royalblue-theme.html',
  styleUrl: './royalblue-theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoyalblueTheme {
  public readonly swatches: Palette[] = ROYALBLUE_PALETTE_DATA;
}
