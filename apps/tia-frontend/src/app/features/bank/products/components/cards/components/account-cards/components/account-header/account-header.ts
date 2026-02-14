import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-header',
  templateUrl: './account-header.html',
  styleUrls: ['./account-header.scss'],
  imports: [Badges, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHeader {
  readonly account = input.required<CardAccount>();
readonly cardsLabel = input.required<{ count: string; key: string }>();
}