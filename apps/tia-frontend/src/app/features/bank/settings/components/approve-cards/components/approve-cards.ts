import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PendingCard } from '../shared/model/approve-cards.model';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { CardsApproveElement } from '../ui/cards-approve-element';
import {
  buttonEmit,
} from '../shared/model/approve-card-element.model';

@Component({
  selector: 'app-approve-cards',
  imports: [CardsApproveElement],
  templateUrl: './approve-cards.html',
  providers: [ApproveCardsStore],
  styleUrl: './approve-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveCards implements OnInit {
  public readonly store = inject(ApproveCardsStore);

  public cardInfo = signal<PendingCard[]>([]);

  ngOnInit():void {
    this.store.load();
  }

  public handleAction(event: buttonEmit): void {
    const { action, id } = event;
  }
}
