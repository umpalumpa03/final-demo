import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { CommonModule } from '@angular/common';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ACCOUNT_ACTIONS } from '../../config/accounts.config';

@Component({
  selector: 'app-change-name',
  imports: [
    CommonModule,
    UiModal,
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './change-name.html',
  styleUrls: ['./change-name.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeName {
  private readonly fb = inject(FormBuilder);
  public readonly isOpen = input.required<boolean>();
  public readonly close = output<void>();
  public readonly submit = output<string>();
  public readonly initialName = input<string | undefined>();
  public readonly initialAccountNumber = input<string | null>(null);

  public readonly actions = ACCOUNT_ACTIONS;

  public nameForm = this.fb.group({
    name: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const name = this.initialName();
      if (name) {
        this.nameForm.patchValue({ name });
      } else if (!this.isOpen?.()) {
        this.nameForm.reset();
      }
    });
  }

  public onClose(): void {
    this.nameForm.reset();
    this.close.emit();
  }

  public onSubmit(): void {
    const value = (this.nameForm.get('name')?.value || '').trim();
    if (value) {
      this.submit.emit(value);
    }
  }

  public accountNumber(iban: string | null): string | null {
    return iban;
  }
}
