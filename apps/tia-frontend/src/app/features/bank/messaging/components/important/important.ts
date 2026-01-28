import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-important',
  imports: [MailHeader, TranslatePipe],
  templateUrl: './important.html',
  styleUrl: './important.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Important {}
