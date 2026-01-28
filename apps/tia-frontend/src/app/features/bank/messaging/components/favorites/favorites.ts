import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  imports: [MailHeader, TranslatePipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Favorites {}
