import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ProductsActions } from '../../../../../store/products/products.actions';
import {
  selectAccountsGrouped,
  selectIsLoading,
  selectIsCreateModalOpen,
  selectError,
} from '../../../../../store/products/products.selectors';
import { AccountCardComponent } from './components/account-card/account-card';
import { ButtonComponent } from '../../../../../shared/lib/primitives/button/button';
import { BasicCard } from '../../../../../shared/lib/cards/basic-card/basic-card';
import { RouteLoader } from '../../../../../shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-accounts-page',
  imports: [
    CommonModule,
    AccountCardComponent,
    ButtonComponent,
    BasicCard,
    RouteLoader,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts implements OnInit {
  private readonly store = inject(Store);

  protected readonly accountsGrouped$ = this.store.select(
    selectAccountsGrouped,
  );
  protected readonly isLoading$ = this.store.select(selectIsLoading);
  protected readonly isCreateModalOpen$ = this.store.select(
    selectIsCreateModalOpen,
  );
  protected readonly error$ = this.store.select(selectError);

  protected readonly accountSections = [
    {
      key: 'current' as const,
      title: 'Current Accounts',
      icon: '/images/svg/account/wallet.svg',
    },
    {
      key: 'saving' as const,
      title: 'Savings Accounts',
      icon: '/images/svg/account/piggy-bank.svg',
    },
    {
      key: 'card' as const,
      title: 'Cards',
      icon: '/images/svg/account/building.svg',
    },
  ];

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadAccounts());
  }

  public handleTransfer(accountId: string): void {
    console.log('Transfer', accountId);
  }
}
