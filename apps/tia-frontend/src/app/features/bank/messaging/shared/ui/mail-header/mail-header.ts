import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-mail-header',
  imports: [TranslatePipe, Checkboxes, ButtonComponent],
  templateUrl: './mail-header.html',
  styleUrl: './mail-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailHeader {
  public readonly page = input<string>();
  public readonly messageCount = input<number>();
  public readonly isAllSelected = input<boolean>();
  public readonly toggleSelectAll = output<boolean>();
  public readonly isSent = input<boolean>(false);
  public readonly isDraft = input<boolean>(false);

  public readonly showBulkActions = input<boolean>(false);
  public readonly bulkDelete = output<void>();
  public readonly bulkRead = output<void>();

}
