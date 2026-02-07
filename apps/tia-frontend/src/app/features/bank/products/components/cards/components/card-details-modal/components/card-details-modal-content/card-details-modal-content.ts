import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CardSensitiveData } from '../../../../models/card-sensitive-data.model';

@Component({
  selector: 'app-card-details-modal-content',
  templateUrl: './card-details-modal-content.html',
  styleUrls: ['./card-details-modal-content.scss'],
  imports: [
    Badges,
    ButtonComponent,
    BasicCard,
    TranslatePipe,
    ReactiveFormsModule,
    TextInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsModalContent {
 public readonly cardName = input.required<string>();
 public readonly cardType = input.required<string>();
 public readonly currency = input.required<string>();
 public readonly status = input.required<string>();
 public readonly isActiveStatus = input.required<boolean>();
 public readonly formattedBalance = input.required<string>();
 public readonly shouldShowCreditLimit = input.required<boolean>();
 public readonly formattedCreditLimit = input.required<string>();
 public readonly cardCategory = input.required<string>();
 public readonly requestOtpClicked = output<void>();
 public readonly closeClicked = output<void>();
 public readonly isUpdating = input.required<boolean>();
 public readonly cardNameUpdated = output<string>();
 public readonly cardSensitiveData = input<CardSensitiveData | null>(null);
 public  readonly displayedName = linkedSignal(() => this.cardName());
  protected readonly copiedField = signal<string | null>(null);

  protected handleRequestOtp(): void {
    this.requestOtpClicked.emit();
  }
  protected handleClose(): void {
    this.closeClicked.emit();
  }
  protected readonly isEditing = signal<boolean>(false);
  protected readonly nameControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  protected enableEdit(event: Event): void {
    event.stopPropagation();
    this.nameControl.setValue(this.cardName());
    this.isEditing.set(true);
  }

  protected onBlur(): void {
    if (this.nameControl.valid) {
      this.onSave();
    } else {
      this.isEditing.set(false);
    }
  }

  protected onSave(): void {
    if (this.nameControl.invalid) {
      return;
    }

    const newName = this.nameControl.value.trim();
    const oldName = this.cardName();

    if (newName && newName !== oldName) {
      this.displayedName.set(newName);
      this.cardNameUpdated.emit(newName);
    }

    this.isEditing.set(false);
  }
  protected copyToClipboard(text: string, field: string): void {
    navigator.clipboard.writeText(text);
    this.copiedField.set(field);
    setTimeout(() => this.copiedField.set(null), 2000);
  }
}
