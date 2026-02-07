import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PendingCard } from '../shared/model/approve-cards.model';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { CardsApproveElement } from '../approve-card-element/cards-approve-element';
import {
  buttonEmit,
} from '../shared/model/approve-card-element.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PermissionsModal } from '../../approve-accounts/components/permissions-modal/permissions-modal';
import { FormBuilder } from '@angular/forms';
import { ApproveCardsService } from '../shared/services/approve-cards.service';

@Component({
  selector: 'app-approve-cards',
  imports: [CardsApproveElement, Skeleton, Spinner, ErrorStates, PermissionsModal, UiModal],
  templateUrl: './approve-cards.html',
  providers: [ApproveCardsStore],
  styleUrl: './approve-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveCards implements OnInit {
  public readonly store = inject(ApproveCardsStore);

  public readonly fb = inject(FormBuilder);

  public cardPermissionsForm = this.fb.nonNullable.group({

  });

  public cardInfo = signal<PendingCard[]>([]);

  public perrmissionsOverlay = signal<boolean>(false);

  ngOnInit():void {
    this.store.load();
    this.store.loadPerrmisions();
  }

  public handleAction(event: buttonEmit): void {
    const { action, id } = event;
    switch(action) {
      case("permissions"):
      this.handlePermissions(id);
      break;

      case("approve"): 
      this.handleApprove(id);
      break;

      case("decline"): 
      this.handleDecline(id);
      break;
    }
  }

  // Empty Cards - retry 
  // Dynamic Permissions To add
  private handleApprove(id:string):void {
    this.store.updateStatus({
      cardId: id,
      status: "ACTIVE",
      permissions:[]
    })
  }

  private handleDecline(id:string):void {
    this.store.updateStatus({
      cardId: id,
      status: "CANCELLED",
      permissions:[]
    })
  }

  private handlePermissions(id: string): void {
    this.perrmissionsOverlay.set(true)
  }
  
}
