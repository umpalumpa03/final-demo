import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  DestroyRef,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { getTransferTabs } from '../components/transfers-external/config/transfer-tabs.config';
import { TransferStore } from '../store/transfers.store';
import { TransferRepeatService } from '../services/transfer-repeat.service';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

@Component({
  selector: 'app-transfers-container',
  imports: [Tabs, RouterModule, LibraryTitle, TranslatePipe, RouteLoader],
  templateUrl: './transfers-container.html',
  styleUrl: './transfers-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersContainer implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly transferStore = inject(TransferStore);
  private readonly repeatService = inject(TransferRepeatService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly transferTabs = signal<TabItem[]>(
    getTransferTabs(this.translate),
  );
  public isLoadingMeta = signal(false);

  public ngOnInit(): void {
    this.store
      .select(selectTransactionToRepeat)
      .pipe(take(1))
      .subscribe((transaction) => {
        if (transaction) {
          this.isLoadingMeta.set(true);
          this.repeatService.initRepeatTransfer(transaction);

          this.router.events
            .pipe(
              filter((event) => event instanceof NavigationEnd),
              take(1),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
              this.isLoadingMeta.set(false);
              this.store.dispatch(
                TransactionActions.clearTransactionToRepeat(),
              );
            });
        }
      });
  }

  public ngOnDestroy(): void {
    this.transferStore.reset();
  }
}
