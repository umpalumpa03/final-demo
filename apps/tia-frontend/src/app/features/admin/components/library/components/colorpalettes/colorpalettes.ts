import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { Palettes } from '../../../../../../shared/lib/palettes/palettes';
import { colorPalettes } from './config/palette-data.config';
import { ColorApplication } from '../../../../../../shared/lib/palettes/color-application/color-application';

@Component({
  selector: 'app-colorpalettes',
  imports: [LibraryTitle, ShowcaseCard, Palettes, ColorApplication],
  templateUrl: './colorpalettes.html',
  styleUrl: './colorpalettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpalettes {
  public readonly title = 'Color Palettes';
  public readonly colorPalettesData = colorPalettes;
}
