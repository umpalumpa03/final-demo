import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-settings-body',
  imports: [],
  templateUrl: './settings-body.html',
  styleUrl: './settings-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBody {
  public readonly title = input<string | null>(null);
  public readonly subTitle = input<string | null>(null);
}
