import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ApproveCards } from '../components/approve-cards';


@Component({
  selector: 'app-approve-cards-container',
  imports: [BasicCard, ApproveCards],
  templateUrl: './approve-cards-container.html',
  styleUrl: './approve-cards-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveCardsContainer {
}
