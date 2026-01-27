import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';

@Component({
  selector: 'app-draft',
  imports: [MailHeader],
  templateUrl: './draft.html',
  styleUrl: './draft.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Draft {}
