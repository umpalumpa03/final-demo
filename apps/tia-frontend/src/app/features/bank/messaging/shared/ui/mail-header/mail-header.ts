import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-mail-header',
  imports: [],
  templateUrl: './mail-header.html',
  styleUrl: './mail-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailHeader {
  public readonly page = input<string>();
  public readonly messageCount = input<number>();
}
