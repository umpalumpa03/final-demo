import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';

@Component({
  selector: 'app-sent',
  imports: [MailHeader],
  templateUrl: './sent.html',
  styleUrl: './sent.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sent {}
