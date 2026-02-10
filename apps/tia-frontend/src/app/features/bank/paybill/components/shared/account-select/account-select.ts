import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  untracked,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';

@Component({
  selector: 'app-account-select',
  imports: [Dropdowns],
  templateUrl: './account-select.html',
  styleUrl: './account-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSelect implements OnInit {
  private readonly store = inject(Store);
  public readonly selectedAccountId = model<string | null>(null);
  public readonly currentAccounts = this.store.selectSignal(
    selectGelAccountOptions,
  );
  public readonly accountChanged = output<string>();
  public maxVisible = input.required<number>();
  public isHeader = input<boolean>();

  constructor() {
    effect(() => {
      const accounts = this.currentAccounts();

      if (accounts && accounts.length > 0 && !this.selectedAccountId()) {
        const favoriteAccount = accounts.find((acc) => acc.isFavorite);

        if (favoriteAccount) {
          untracked(() => {
            this.selectedAccountId.set(favoriteAccount.value);
            this.handleAccountChange(favoriteAccount.value);
          });
        }
      }
    });
  }

  public handleAccountChange(id: string): void {
    this.accountChanged.emit(id);
  }

  ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }
}
