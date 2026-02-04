import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { SelectConfig } from '@tia/shared/lib/forms/models/dropdowns.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-categorize-modal',
  imports: [
    BasicCard,
    Dropdowns,
    TextInput,
    ButtonComponent,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './categorize-modal.html',
  styleUrl: './categorize-modal.scss',
})
export class CategorizeModal {
  private readonly fb = inject(FormBuilder);

  public title = signal<string>('Categorize Transaction');
  public subTitle = signal<string>(
    'Assign a category to this transaction for better organization',
  );

  public transaction = input<ITransactions | null>(null);
  public selectCategoryOptions = input.required<SelectOption[]>();

  public save = output<{ transactionId: string; categoryId: string }>();
  public cancel = output<void>();

  public form = this.fb.group({
    categoryId: [null as string | null],
    newCategoryName: [''],
  });

  public selectConfig = computed<SelectConfig>(() => ({
    label: 'Select Category',
    placeholder: 'Select category',
    height: '3.6rem',
  }));

  public onSave(): void {
    const categoryId = this.form.value.categoryId;
    const transaction = this.transaction();

    if (categoryId && transaction) {
      this.save.emit({ transactionId: transaction.id, categoryId });
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }
}
