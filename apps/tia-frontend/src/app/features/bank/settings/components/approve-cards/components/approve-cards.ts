import { ChangeDetectionStrategy, Component,  inject, OnInit, signal } from '@angular/core';
import { UserCard } from '../../user-management/shared/ui/user-card/user-card';
import { PendingCard } from '../shared/model/approve-cards.model';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-approve-cards',
  imports: [Skeleton],
  templateUrl: './approve-cards.html',
  providers: [ApproveCardsStore],
  styleUrl: './approve-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproveCards implements OnInit{
  public readonly store = inject(ApproveCardsStore)

  public cardInfo = signal<PendingCard[]>([])

  ngOnInit() {
    this.store.load()
  }

}
