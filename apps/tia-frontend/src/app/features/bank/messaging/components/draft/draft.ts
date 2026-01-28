import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-draft',
  imports: [MailHeader, TranslatePipe],
  templateUrl: './draft.html',
  styleUrl: './draft.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Draft {}
