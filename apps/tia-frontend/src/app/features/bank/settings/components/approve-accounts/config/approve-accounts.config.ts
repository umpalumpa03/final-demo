import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApproveAccountsConfig {
  private readonly translate = inject(TranslateService);

  public textConfig = signal({
    card: {
      title: this.translate.instant('settings.approve-accounts.card.title'),
      subtitle: this.translate.instant(
        'settings.approve-accounts.card.subtitle',
      ),
    },
    errorState: {
      header: this.translate.instant(
        'settings.approve-accounts.errorState.header',
      ),
      message: this.translate.instant(
        'settings.approve-accounts.errorState.message',
      ),
    },
    permissionsModal: {
      modalTitle: this.translate.instant(
        'settings.approve-accounts.permissionsModal.modalTitle',
      ),
      modalSubtitle: this.translate.instant(
        'settings.approve-accounts.permissionsModal.modalSubtitle',
      ),
      title: this.translate.instant(
        'settings.approve-accounts.permissionsModal.title',
      ),
    },
    confirmDialog: {
      title: this.translate.instant(
        'settings.approve-accounts.confirmDialog.title',
      ),
      subtitle: this.translate.instant(
        'settings.approve-accounts.confirmDialog.subtitle',
      ),
      cancelBtn: this.translate.instant(
        'settings.approve-accounts.confirmDialog.cancelBtn',
      ),
      confirmBtn: this.translate.instant(
        'settings.approve-accounts.confirmDialog.confirmBtn',
      ),
    },
  });
}
