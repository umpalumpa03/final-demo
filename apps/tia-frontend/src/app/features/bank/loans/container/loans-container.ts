import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LoanHeader } from '../shared/ui/loan-header/loan-header';
import { LoanNavigation } from '../shared/ui/loan-navigation/loan-navigation';
import { RouterModule } from '@angular/router';
import { RequestModal } from '../shared/ui/request-modal/request-modal';
import { Store } from '@ngrx/store';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { LoansStore } from '../store/loans.store';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { LoanDetails } from '../shared/ui/prepayment/loan-details/loan-details';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PrepaymentContainer } from '../shared/ui/prepayment/prepayment-container/prepayment-container';
import { LoanDashboardState } from '../shared/state/loan-dashboard.state';

@Component({
  selector: 'app-loans-container',
  imports: [
    LoanHeader,
    LoanNavigation,
    RouterModule,
    RequestModal,
    Skeleton,
    AlertTypesWithIcons,
    TextInput,
    LoanDetails,
    UiModal,
    PrepaymentContainer,
  ],
  templateUrl: './loans-container.html',
  styleUrl: './loans-container.scss',
  providers: [LoanDashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansContainer {
  private globalStore = inject(Store);
  public readonly loanDashboardState = inject(LoanDashboardState);
  protected readonly store = inject(LoansStore);

  private readonly searchSubject = new Subject<string>();

  public isModalOpen = signal(false);

  protected isLoading = this.store.loading;
  protected readonly alertConfig = this.store.alert;

  constructor() {
    this.searchSubject
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        takeUntilDestroyed(),
        tap((query) => {
          this.store.setSearchQuery(query);
        }),
      )
      .subscribe();
  }

  public onSearch(value: InputFieldValue): void {
    const query = value ? String(value) : '';
    this.searchSubject.next(query);
  }

  public ngOnInit(): void {
    this.globalStore.dispatch(AccountsActions.loadAccounts({}));
  }

  ngOnDestroy(): void {
    this.store.reset();
    this.store.setSearchQuery('');
  }
}
