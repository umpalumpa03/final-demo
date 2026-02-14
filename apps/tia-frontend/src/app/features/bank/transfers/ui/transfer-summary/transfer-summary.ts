import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TransferAccount } from '../../models/transfers.ui.model';

@Component({
  selector: 'app-transfer-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './transfer-summary.html',
  styleUrls: ['./transfer-summary.scss'],
})
export class TransferSummaryComponent {
  senderAccount = input.required<TransferAccount | null>();
  recipientAccount = input.required<TransferAccount | null>();
  recipientInitials = input.required<string>();
  recipientName = input<string>();
  fromLabel = input.required<string>();
  toLabel = input.required<string>();
}
