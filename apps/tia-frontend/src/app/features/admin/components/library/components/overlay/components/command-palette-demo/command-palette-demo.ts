import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiCommandPalette } from '../../../../../../../../shared/lib/overlay/ui-command-palette/ui-command-palette';
import { myCommandActions } from './config/command-palette.config';

@Component({
  selector: 'app-command-palette-demo',
  imports: [UiCommandPalette],
  templateUrl: './command-palette-demo.html',
  styleUrl: './command-palette-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteDemo {
  public readonly myCommandActions = myCommandActions;
}
