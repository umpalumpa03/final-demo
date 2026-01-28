import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { getRecipientInputConfig } from '../../config/transfers-external.config';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-external-recipient',
  imports: [TranslatePipe, TextInput, ButtonComponent],
  templateUrl: './external-recipient.html',
  styleUrl: './external-recipient.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalRecipient {
  private translate = inject(TranslateService);
  recipientInputConfig = getRecipientInputConfig(this.translate);
}
