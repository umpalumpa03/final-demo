import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  linkedSignal,
  output,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { ILoan } from '../../models/loan.model';
import {
  DEFAULT_UI_CONFIG,
  LOAN_ICONS,
  LOAN_UI_CONFIG,
} from '../../config/loan-icons.config';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { toTitleCase } from '../../utils/titlecase.util';
import { PurposeFormatPipe } from '../../pipes/purpose.pipe';
import { CurrencySymbolPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'lib-loan-card',
  imports: [
    CommonModule,
    BasicCard,
    ReactiveFormsModule,
    TextInput,
    PurposeFormatPipe,
    CurrencySymbolPipe,
  ],
  templateUrl: './loan-card.html',
  styleUrl: './loan-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanCard {
  protected readonly loanIcons = signal(LOAN_ICONS);

  public readonly loan = input.required<ILoan>();
  public readonly variant = input<'default' | 'colored'>('default');

  public readonly cardClick = output<string>();
  public readonly rename = output<{ id: string; name: string }>();

  protected readonly isEditing = signal(false);

  protected readonly displayedName = linkedSignal(
    () => this.loan().friendlyName || this.loan().purpose || '',
  );

  protected readonly nameControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(25)],
  });

  protected readonly nameInput =
    viewChild<ElementRef<HTMLInputElement>>('nameInput');

  protected readonly config = computed(() => {
    const status = this.loan().status;
    const isColored = this.variant() === 'colored';
    const ui = LOAN_UI_CONFIG[status] || DEFAULT_UI_CONFIG;
    const badgeClass = ui.badge;
    const iconClass = isColored
      ? `card__icon--${ui.color}`
      : 'card__icon--blue';
    const iconKey = isColored ? ui.iconKey : 'default';
    const iconSrc = this.loanIcons()[iconKey];
    return { badgeClass, iconClass, iconSrc };
  });

  protected readonly showPaymentDetails: Signal<boolean> = computed(
    () => this.loan().status === 2,
  );

  protected enableEdit(event: Event): void {
    event.stopPropagation();
    this.nameControl.setValue(this.displayedName());
    this.isEditing.set(true);
    setTimeout(() => {
      this.nameInput()?.nativeElement?.focus();
    });
  }

  protected onSave(): void {
    if (!this.isEditing()) return;

    if (this.nameControl.invalid) return;

    const newName = toTitleCase(this.nameControl.value.trim());
    const oldName = this.loan().friendlyName || this.loan().purpose;

    if (newName && newName !== oldName) {
      this.displayedName.set(newName);

      this.rename.emit({ id: this.loan().id, name: newName });
    }

    this.isEditing.set(false);
  }

  protected onBlur(): void {
    if (this.nameControl.valid) {
      this.onSave();
    } else {
      this.isEditing.set(false);
    }
  }
}
