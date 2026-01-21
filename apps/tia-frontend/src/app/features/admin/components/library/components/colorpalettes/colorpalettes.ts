import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LibraryHeader } from '../../shared/library-header/library-header';
import { OceanblueTheme } from '../../../../../../shared/lib/palettes/oceanblue-theme/oceanblue-theme';

@Component({
  selector: 'app-colorpalettes',
  imports: [LibraryHeader, OceanblueTheme],
  templateUrl: './colorpalettes.html',
  styleUrl: './colorpalettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpalettes {}
