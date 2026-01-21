import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorSwitch } from '@tia/shared/lib/color-switching-buttons/color-switch/color-switch';



@Component({
  selector: 'app-library-header',
  imports: [ColorSwitch],
  templateUrl: './library-header.html',
  styleUrl: './library-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryHeader {}
