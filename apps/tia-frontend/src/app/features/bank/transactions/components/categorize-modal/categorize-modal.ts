import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { DatePipe } from '@angular/common';
import {
  CATEGORIZE_MODAL_CONFIG,
  CATEGORY_SELECT_CONFIG,
  NEW_CATEGORY_INPUT_CONFIG,
} from '../../config/categorize-modal.config';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({
  selector: 'app-categorize-modal',
  imports: [
    Dropdowns,
    TextInput,
    ButtonComponent,
    DatePipe,
    ReactiveFormsModule,
    TranslateModule,
    TranslatePipe,
    Tooltip,
  ],
  templateUrl: './categorize-modal.html',
  styleUrl: './categorize-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorizeModal {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly alertService = inject(AlertService);

  public readonly modalConfig = CATEGORIZE_MODAL_CONFIG;
  public readonly selectConfig = CATEGORY_SELECT_CONFIG;
  public readonly inputConfig = NEW_CATEGORY_INPUT_CONFIG;

  public title = CATEGORIZE_MODAL_CONFIG.title;
  public subTitle = CATEGORIZE_MODAL_CONFIG.subTitle;

  public transaction = input<ITransactions | null>(null);
  public selectCategoryOptions = input.required<SelectOption[]>();

  public save = output<{ transactionId: string; categoryId: string }>();
  public cancel = output<void>();
  public createCategory = output<string>();

  public form = this.fb.group({
    categoryId: [null as string | null, Validators.required],
    newCategoryName: [''],
  });

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

  public onCategoryCreate(): void {
    const categoryName = this.form.value.newCategoryName;

    if (categoryName) {
      this.createCategory.emit(categoryName);
      this.form.controls.newCategoryName.reset();

      const msg = this.translate.instant(
        'transactions.categorize_modal.messages.success_added',
        { name: categoryName },
      );

      this.alertService.success(msg, {
        variant: 'dismissible',
        title: this.translate.instant('Success') || 'Success',
      });
    }
  }
}
