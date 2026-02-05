import {ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  OnInit,
  DestroyRef,
  effect,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferInternalService } from '../../../../services/transfer.internal.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { tap } from 'rxjs';
import { SuccessModal } from '@tia/shared/lib/overlay/ui-success-modal/ui-success-modal';
import { Router } from '@angular/router';
import { OtpModal } from '@tia/shared/lib/overlay/ui-otp-modal/otp-modal';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';

@Component({
  selector: 'app-internal-amount',
  imports: [
    ButtonComponent,
    TranslatePipe,
    TextInput,
    ReactiveFormsModule,
    AlertTypesWithIcons,
    DecimalPipe,
    SuccessModal,
    RouteLoader,
    Tooltip,
  ],
  templateUrl: './internal-amount.html',
  styleUrl: './internal-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalAmount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly transferInternalService = inject(TransferInternalService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly isMobile = this.breakpointService.isMobile;
  public readonly showSuccess = signal(false);
  public readonly showError = signal(false);
  public readonly currentToastMessage = signal('');

  public readonly isLoading = this.transferStore.isLoading;
  public readonly selectedSenderAccount = this.transferStore.senderAccount;
  public readonly selectedRecipientAccount = this.transferStore.receiverOwnAccount;
  public readonly hasInsufficientBalance = this.transferStore.hasInsufficientBalance;
  public readonly successfulTransfer = this.transferStore.transferSuccess;
  public readonly requiresOtp = this.transferStore.requiresOtp;
  public readonly errorFromState = this.transferStore.error;

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
    label: `${this.translate.instant('transfers.internal.amount.label')} (${this.currency()})`,
    placeholder: '0.00',
  }));

  public readonly descriptionConfig = computed(() => ({
    label: this.translate.instant('transfers.internal.amount.description.label'),
    placeholder: this.translate.instant('transfers.internal.amount.description.placeholder'),
  }));

  public readonly availableBalance = computed(
    () => this.selectedSenderAccount()?.balance ?? 0,
  );

  public readonly recipientInitials = computed(() => {
    const name = this.selectedRecipientAccount()?.friendlyName || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });

  public readonly isTransferDisabled = computed(() => {
    const isInvalid = this.amountInput.status !== 'VALID';
    return isInvalid || this.isLoading() || this.hasInsufficientBalance();
  });

  constructor() {
    effect(() => {
      const error = this.errorFromState();
      if (error) {
        this.showError.set(true);
        setTimeout(() => {
          this.showError.set(false);
          this.transferStore.setError('');
        }, 3000);
      }
    });
  }

  public ngOnInit(): void {
    this.amountInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          this.transferInternalService.handleAmountInput(Number(value));
        }),
      )
      .subscribe();

    this.triggerToast('transfers.internal.amount.accountsSelected');
  }

  public onGoBack(): void {
    this.transferInternalService.handleAmountGoBack(
      Number(this.amountInput.value),
      this.descriptionInput.value || '',
    );
  }

  public onTransfer(): void {
    if (this.amountInput.valid) {
      this.transferStore.setDescription(this.descriptionInput.value || '');
      this.transferInternalService.handleToOwnTransfer();
    }
  }

  private triggerToast(messageKey: string): void {
    this.currentToastMessage.set(messageKey);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }

  public onSuccessDone(): void {
    this.transferStore.reset();
    this.router.navigate(['/bank/dashboard']);
  }
}
