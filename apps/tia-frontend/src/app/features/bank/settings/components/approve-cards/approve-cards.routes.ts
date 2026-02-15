import { Routes } from '@angular/router';
import { ApproveCardsState } from './shared/state/approve-cards.state';
import { ApproveCardsService } from './shared/services/approve-cards.service';

export const approveCards: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/approve-cards-container').then(
        (c) => c.ApproveCardsContainer,
      ),
    providers: [ApproveCardsService, ApproveCardsState],
  },
];
