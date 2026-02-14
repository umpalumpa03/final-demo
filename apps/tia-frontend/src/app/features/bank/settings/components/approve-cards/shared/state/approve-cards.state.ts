import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApproveCardsState {
  private readonly translate = inject(TranslateService);

  public newConfig = signal({
    title: this.translate.instant('settings.approve-cards.title'),
    subtitle: this.translate.instant('settings.approve-cards.subtitle'),
    permissionsModal: {
        modalTitle: this.translate.instant('settings.approve-cards.modal.title'),
        modalSubtitle: this.translate.instant('settings.approve-cards.modal.subtitle'),
        title: this.translate.instant('settings.approve-cards.modal.permissionsTitle')
    },
    alertMessages: {
      successDesc: this.translate.instant('settings.approve-cards.alertMessages.successDesc'),
      errorDesc: this.translate.instant('settings.approve-cards.alertMessages.errorDesc')
    },
    confirmOverlay: {
      title: this.translate.instant('settings.approve-cards.confirmOverlay.title'),
      subtitle: this.translate.instant('settings.approve-cards.confirmOverlay.subtitle'),
      cancelAction: this.translate.instant('settings.approve-cards.confirmOverlay.cancelAction'),
      confirmAction: this.translate.instant('settings.approve-cards.confirmOverlay.confirmAction')
    }
  });
}
