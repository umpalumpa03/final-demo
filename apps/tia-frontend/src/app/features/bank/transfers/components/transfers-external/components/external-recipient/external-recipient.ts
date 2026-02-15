import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  DestroyRef,
  effect,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  getRecipientInputConfig,
  getRecipientIconByType,
} from '../../config/transfers-external.config';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
import { recipientValidator } from '../../validators/transfer-validator';
import { TransferValidationService } from '../../../../services/transfer-validation.service';
import {
  getErrorMessage,
  getSuccessMessage,
} from '../../utils/transfers-external.utils';
import { RecipientType } from '../../../../models/transfers.state.model';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferRecipientService } from '../../services/transfer-recipient.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-external-recipient',
  imports: [
    TranslatePipe,
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    Tooltip,
  ],
  providers: [],
  templateUrl: './external-recipient.html',
  styleUrl: './external-recipient.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalRecipient implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly recipientService = inject(TransferRecipientService);
  private readonly fb = inject(FormBuilder);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly transferStore = inject(TransferStore);
  private readonly breakpointService = inject(BreakpointService);
  private readonly alertService = inject(AlertService);

  public readonly isMobile = this.breakpointService.isMobile;
  public readonly isLoading = computed(() => this.transferStore.isLoading());
  public readonly recipientInputConfig = signal<InputConfig>(
    getRecipientInputConfig(this.translate),
  );

  public readonly recipientInput = this.fb.control('', [
    recipientValidator(this.validationService),
  ]);

  constructor() {
    effect(() => {
      const error = this.transferStore.error();

      if (error) {
        this.alertService.error(this.translate.instant(error));
        this.recipientInput.reset();
        this.clearMessages();
        this.transferStore.setError('');
      }
    });
  }

  public ngOnInit(): void {
    const storedValue = this.transferStore.recipientInput();
    if (storedValue) {
      this.recipientInput.setValue(storedValue, { emitEvent: false });
    }

    this.setupValueChangeListener();
  }

  private setupValueChangeListener(): void {
    this.recipientInput.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.updateInputConfig(value);
      });
  }

  private updateInputConfig(value: string | null): void {
    if (!value) {
      this.clearMessages();
      return;
    }

    const type = this.validationService.identifyRecipientType(value);
    const isValid = this.recipientInput.valid;
    const errors = this.recipientInput.errors;

    if (isValid && type) {
      this.setSuccessMessage(type);
      this.updateIcon(type);
    } else if (errors) {
      this.setErrorMessage(errors);
      this.updateIcon(null);
    }
  }

  private clearMessages(): void {
    this.recipientInputConfig.update((config) => ({
      ...config,
      errorMessage: undefined,
      successMessage: undefined,
      prefixIcon: 'images/svg/transfers/person.svg',
    }));
  }

  private setSuccessMessage(type: RecipientType): void {
    this.recipientInputConfig.update((config) => ({
      ...config,
      successMessage: getSuccessMessage(type, this.translate),
      errorMessage: undefined,
    }));
  }

  private setErrorMessage(errors: ValidationErrors): void {
    this.recipientInputConfig.update((config) => ({
      ...config,
      errorMessage: getErrorMessage(errors, this.translate),
      successMessage: undefined,
    }));
  }

  private updateIcon(type: RecipientType | null): void {
    this.recipientInputConfig.update((config) => ({
      ...config,
      prefixIcon: getRecipientIconByType(type),
    }));
  }

  public onVerify(): void {
    if (this.recipientInput.valid && this.recipientInput.value) {
      this.recipientService.verifyRecipient(this.recipientInput.value);
    }
  }
}
