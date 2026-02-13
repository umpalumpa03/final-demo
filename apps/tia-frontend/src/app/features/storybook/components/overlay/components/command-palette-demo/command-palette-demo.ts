import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiCommandPalette } from '../../../../../../shared/lib/overlay/ui-command-palette/ui-command-palette';
import { getCommandActions } from './config/command-palette.config';

@Component({
  selector: 'app-command-palette-demo',
  imports: [UiCommandPalette],
  templateUrl: './command-palette-demo.html',
  styleUrl: './command-palette-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteDemo implements OnInit {
  private readonly translate = inject(TranslateService);

  public readonly myCommandActions = signal(getCommandActions(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.myCommandActions.set(getCommandActions(this.translate));
    });
  }
}
