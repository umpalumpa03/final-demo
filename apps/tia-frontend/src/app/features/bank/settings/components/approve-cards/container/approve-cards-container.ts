import { ChangeDetectionStrategy, Component, inject, } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ApproveCards } from '../components/approve-cards';
import { ApproveCardsState } from '../shared/state/approve-cards.state';


@Component({
  selector: 'app-approve-cards-container',
  imports: [BasicCard, ApproveCards],
  templateUrl: './approve-cards-container.html',
  styleUrl: './approve-cards-container.scss',
  providers: [ApproveCardsState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveCardsContainer {
  public readonly userState = inject(ApproveCardsState);
}
