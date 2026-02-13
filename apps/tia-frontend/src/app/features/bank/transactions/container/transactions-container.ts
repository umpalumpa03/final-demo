import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TransactionActionEvent } from '@tia/shared/lib/tables/models/table.model';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TransactionsFilters } from '../components/transactions-filters/transactions-filters';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { CategorizeModal } from '../components/categorize-modal/categorize-modal';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TransactionsFacadeService } from '../services/transactions-facade.service';
import { TransactionsViewModelService } from '../services/transactions-view-model.service';
import { TransactionsActionsService } from '../services/transactions-actions.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';

@Component({
  selector: 'app-transactions-container',
  imports: [
    RouteLoader,
    Tables,
    TransactionsFilters,
    ScrollArea,
    CategorizeModal,
    UiModal,
    SimpleAlerts,
    LibraryTitle,
    TranslatePipe,
    TranslateModule,
    ButtonComponent,
    ErrorStates,
  ],
  providers: [
    TransactionsFacadeService,
    TransactionsViewModelService,
    TransactionsActionsService,
  ],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  public readonly facade = inject(TransactionsFacadeService);
  public readonly vm = inject(TransactionsViewModelService);
  public readonly actions = inject(TransactionsActionsService);

  public ngOnInit(): void {
    this.facade.initializePage();
  }

  public onFiltersChange(filters: Partial<ITransactionFilter>) {
    this.facade.updateFilters(filters);
  }

  public retryLoad(): void {
    this.facade.retryLoad();
  }

  public onTableAction(event: TransactionActionEvent): void {
    const trx = this.facade.items().find((item) => item.id === event.rowId);
    if (!trx) return;

    if (event.action === 'categorize') this.actions.openCategorizeModal(trx);
    if (event.action === 'repeat') this.actions.handleRepeatAction(trx);
    if (event.action === 'extract') {
      this.actions.exportSingleTransaction(trx);
    }
  }
}
