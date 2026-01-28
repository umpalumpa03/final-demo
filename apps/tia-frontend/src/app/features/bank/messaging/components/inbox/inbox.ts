import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from "../../shared/ui/mail-header/mail-header";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-inbox',
  imports: [MailHeader, TranslatePipe],
  templateUrl: './inbox.html',
  styleUrl: './inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inbox {}
