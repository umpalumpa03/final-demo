import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';

@Component({
  selector: 'app-important',
  imports: [MailHeader],
  templateUrl: './important.html',
  styleUrl: './important.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Important {}
