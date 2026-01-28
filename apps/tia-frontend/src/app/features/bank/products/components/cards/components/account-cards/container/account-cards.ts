import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-account-cards',
  standalone: true,
  templateUrl: './account-cards.html',
  styleUrls: ['./account-cards.scss'],
  imports: [CommonModule, Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCards implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly accountId = this.route.snapshot.paramMap.get('accountId') || '';
  
  private readonly allAccounts = toSignal(
    this.store.select(selectAllAccounts),
    { initialValue: [] }
  );

  protected readonly account = computed(() => 
    this.allAccounts().find(acc => acc.id === this.accountId)
  );

  protected readonly cards = toSignal(
    this.store.select(selectCardDetailsByAccountId(this.accountId)),
    { initialValue: [] }
  );
ngOnInit(): void {
  const account = this.account();
  if (account?.cardIds && account.cardIds.length > 0) {
    account.cardIds.forEach(cardId => {
      this.store.dispatch(loadCardDetails({ cardId }));
    });
  }
}
  protected handleCardClick(cardId: string): void {
    this.router.navigate(['/bank/products/cards/details', cardId]);
  }
}