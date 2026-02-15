import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  effect,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TransactionsActionsService } from '../../services/transactions-actions.service';
import { TransactionsPresenterService } from '../../services/transactions-presenter.service';

@Component({
  selector: 'app-transactions-filters',
  imports: [
    ReactiveFormsModule,
    TextInput,
    Dropdowns,
    ButtonComponent,
    TranslatePipe,
    TranslateModule,
  ],
  providers: [TransactionsPresenterService],
  templateUrl: './transactions-filters.html',
  styleUrl: './transactions-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFilters {
  public readonly actions = inject(TransactionsActionsService);
  public readonly presenter = inject(TransactionsPresenterService);

  public readonly filterChange = output<ITransactionFilter>();

  public readonly categoryOptions = input.required<SelectOption[]>();
  public readonly accountOptions = input<SelectOption[]>([]);
  public readonly currencyOptions = input<SelectOption[]>([]);
  public readonly initialFilters = input<Partial<ITransactionFilter> | null>(
    null,
  );

  constructor() {
    effect(() => this.presenter.categoryOptions.set(this.categoryOptions()));
    effect(() => this.presenter.accountOptions.set(this.accountOptions()));
    effect(() => this.presenter.currencyOptions.set(this.currencyOptions()));
    effect(() => this.presenter.initialFilters.set(this.initialFilters()));

    effect(() => {
      const filters = this.presenter.filtersChanged();
      if (filters) {
        this.filterChange.emit(filters);
      }
    });
  }
}
