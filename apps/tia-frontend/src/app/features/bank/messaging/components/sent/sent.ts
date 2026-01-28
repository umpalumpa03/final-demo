import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sent',
  imports: [MailHeader, TranslatePipe],
  templateUrl: './sent.html',
  styleUrl: './sent.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sent {}
