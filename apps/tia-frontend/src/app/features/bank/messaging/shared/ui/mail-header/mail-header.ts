import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-mail-header',
  imports: [TranslatePipe],
  templateUrl: './mail-header.html',
  styleUrl: './mail-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailHeader {
  public readonly page = input<string>();
  public readonly messageCount = input<number>();


}
