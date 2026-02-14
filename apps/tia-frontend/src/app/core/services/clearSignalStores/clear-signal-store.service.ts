import { inject, Injectable, Injector, Type } from '@angular/core';
import { MessagingStore } from '../../../features/bank/messaging/store/messaging.store';
import { LoansStore } from '../../../features/bank/loans/store/loans.store';
import { UserManagementStore } from '../../../features/bank/settings/components/user-management/store/user-management.store';
import { LoanManagementStore } from '../../../features/bank/settings/components/loan-management/store/loan-management.store';
import { LanguagesStore } from '../../../features/bank/settings/components/language/store/languages.store';
import { NotificationsStore } from '../../../layout/ui/bank-header/components/header-notifications/store/notifications.store';
import { AccountsStore } from '../../../features/bank/settings/components/accounts/strore/accounts.store';

@Injectable({
  providedIn: 'root',
})
export class ClearSignalStoreService {
  private readonly injector = inject(Injector);

  public resetAllStore(): void {
    this.safelyResetStore(AccountsStore, (store) => store.resetStore());
    this.safelyResetStore(LoanManagementStore, (store) =>
      store.clearSelection(),
    );
    this.safelyResetStore(NotificationsStore, (store) => store.resetState());
    this.safelyResetStore(MessagingStore, (store) => store.resetStore());
    this.safelyResetStore(UserManagementStore, (store) => store.reset());
    this.safelyResetStore(LanguagesStore, (store) => store.resetState());
    this.safelyResetStore(LoansStore, (store) => store.reset());
  }

  private safelyResetStore<T>(
    storeType: Type<T>,
    resetFn: (store: T) => void,
  ): void {
    const store = this.injector.get(storeType, null);
    if (store) {
      resetFn(store);
    }
  }
}
