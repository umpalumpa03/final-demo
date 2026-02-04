import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserCard } from '../../user-management/shared/ui/user-card/user-card';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { PendingCard } from '../shared/model/approve-cards.model';
import { takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-approve-cards',
  imports: [UserCard],
  templateUrl: './approve-cards.html',
  styleUrl: './approve-cards.scss',
})
export class ApproveCards implements OnInit{
  private approveCardsService = inject(ApproveCardsService)
  private destroyRef = inject(DestroyRef)
  
  public cardInfo = signal<PendingCard[]>([])

  ngOnInit() {
    this.approveCardsService.getPendingCards().pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(res =>  {
        this.cardInfo.set(res)
        console.log(this.cardInfo())
      }),
    ).subscribe()
  }
}
