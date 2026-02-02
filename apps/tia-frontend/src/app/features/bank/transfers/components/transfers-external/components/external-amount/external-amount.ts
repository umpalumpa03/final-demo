import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BreakpointService } from '@tia/shared/services/breakpoints/breakpoint.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-external-amount',
  imports: [
    ButtonComponent,
    TranslatePipe,
    TextInput,
    ReactiveFormsModule,
    AlertTypesWithIcons,
    DecimalPipe,
  ],
  providers: [],
  templateUrl: './external-amount.html',
  styleUrl: './external-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAmount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly transferExternalService = inject(TransferExternalService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isMobile = this.breakpointService.isMobile;
  public readonly showSuccess = signal(false);
  public readonly currentToastMessage = signal('');

  public readonly isLoading = this.transferStore.isLoading;
  public readonly fee = this.transferStore.fee;
  public readonly totalWithFee = this.transferStore.totalWithFee;
  public readonly selectedSenderAccount = this.transferStore.senderAccount;
  public readonly hasInsufficientBalance =
    this.transferStore.hasInsufficientBalance;
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

  public readonly currency = computed(
    () => this.selectedSenderAccount()?.currency || '',
  );

  public readonly amountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.external.amount.label')} (${this.currency()})`,
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
  private readonly amountStatus = toSignal(this.amountInput.statusChanges, {
    initialValue: this.amountInput.status,
  });
  public readonly isTransferDisabled = computed(() => {
    const isInvalid = this.amountStatus() !== 'VALID';
    return (
      isInvalid ||
      this.isLoading() ||
      this.transferStore.hasInsufficientBalance()
    );
  });

  public ngOnInit(): void {
    this.amountInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          this.transferExternalService.handleAmountInput(Number(value));
        }),
      )
      .subscribe();

    this.triggerToast('transfers.external.amount.accountsSelected');
  }

  public onGoBack(): void {
    this.transferExternalService.handleAmountGoBack(
      Number(this.amountInput.value),
      this.descriptionInput.value || '',
    );
  }
  public onTransfer(): void {
    // if (this.amountInput.valid) {
    //   const success = this.transferExternalService.handleTransfer(
    //     Number(this.amountInput.value),
    //     this.descriptionInput.value || '',
    //   );
    //   if (success) {
    //     this.triggerToast('transfers.confirmation.success');
    //   }
    // }
  }

  private triggerToast(messageKey: string): void {
    this.currentToastMessage.set(messageKey);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }
}
