import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  OnInit,
} from '@angular/core';
import { Location, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';

@Component({
  selector: 'app-external-amount',
  standalone: true,
  imports: [
    ButtonComponent,
    TranslatePipe,
    TextInput,
    ReactiveFormsModule,
    AlertTypesWithIcons,
    DecimalPipe,
  ],
  providers: [TransferExternalService],
  templateUrl: './external-amount.html',
  styleUrl: './external-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAmount implements OnInit {
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly transferExternalService = inject(TransferExternalService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  public readonly showSuccess = signal(false);
  public readonly currentToastMessage = signal('');
  public readonly isLoading = computed(() => this.transferStore.isLoading());

  public readonly selectedSenderAccount = this.transferStore.senderAccount;
  public readonly selectedRecipientAccount =
    this.transferStore.selectedRecipientAccount;
  public readonly manualRecipientName = this.transferStore.manualRecipientName;
  public readonly recipientInfo = this.transferStore.recipientInfo;

  public readonly isExternalIban = computed(
    () => this.transferStore.recipientType() === 'iban-different-bank',
  );

  public readonly amountInput = this.fb.control(
    this.transferStore.amount() || '',
    [Validators.required, Validators.min(0.01)],
  );

  public readonly descriptionInput = this.fb.control(
    this.transferStore.description() || '',
  );

  public readonly amountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.external.amount.label')} (${
      this.selectedSenderAccount()?.currency || ''
    })`,
    placeholder: '0.00',
  }));

  public readonly descriptionConfig = computed(() => ({
    label: this.translate.instant(
      'transfers.external.amount.description.label',
    ),
    placeholder: this.translate.instant(
      'transfers.external.amount.description.placeholder',
    ),
  }));

  public readonly availableBalance = computed(
    () => this.selectedSenderAccount()?.balance ?? 0,
  );

  public readonly recipientInitials = computed(() => {
    const name = this.isExternalIban()
      ? this.manualRecipientName()
      : this.recipientInfo()?.fullName ||
        this.selectedRecipientAccount()?.name ||
        '';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });

  public ngOnInit(): void {
    this.triggerToast('transfers.external.amount.accountsSelected');
  }

  public onGoBack(): void {
    this.transferExternalService.handleAmountGoBack(
      Number(this.amountInput.value),
      this.descriptionInput.value || '',
      this.location,
    );
  }

  public onTransfer(): void {
    if (this.amountInput.valid) {
      const success = this.transferExternalService.handleTransfer(
        Number(this.amountInput.value),
        this.descriptionInput.value || '',
      );
      if (success) {
        this.triggerToast('transfers.confirmation.success');
      }
    }
  }

  private triggerToast(messageKey: string): void {
    this.currentToastMessage.set(messageKey);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }
}
