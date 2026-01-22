import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { OceanblueTheme } from '../../../../../../shared/lib/palettes/oceanblue-theme/oceanblue-theme';

@Component({
  selector: 'app-colorpalettes',
  imports: [LibraryTitle, OceanblueTheme],
  templateUrl: './colorpalettes.html',
  styleUrl: './colorpalettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpalettes {
  public readonly title = 'Color Palettes';
}
