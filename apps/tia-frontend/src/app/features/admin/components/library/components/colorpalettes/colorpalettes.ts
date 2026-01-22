import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { OceanblueTheme } from '../../../../../../shared/lib/palettes/oceanblue-theme/oceanblue-theme';
import { RoyalblueTheme } from '../../../../../../shared/lib/palettes/royalblue-theme/royalblue-theme';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';

@Component({
  selector: 'app-colorpalettes',
  imports: [LibraryTitle, OceanblueTheme, RoyalblueTheme, ShowcaseCard],
  templateUrl: './colorpalettes.html',
  styleUrl: './colorpalettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpalettes {
  public readonly title = 'Color Palettes';
}
