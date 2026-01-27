import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from "../../shared/ui/mail-header/mail-header";

@Component({
  selector: 'app-inbox',
  imports: [MailHeader],
  templateUrl: './inbox.html',
  styleUrl: './inbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Inbox {}
