import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Palette } from '../model/palette.model';
import { DEEPBLUE_PALETTE_DATA } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-deepblue-theme',
  imports: [],
  templateUrl: './deepblue-theme.html',
  styleUrl: './deepblue-theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepblueTheme {
  public readonly swatches: Palette[] = DEEPBLUE_PALETTE_DATA;
}
