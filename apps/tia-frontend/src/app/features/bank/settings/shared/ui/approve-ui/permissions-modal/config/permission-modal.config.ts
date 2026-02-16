import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class permissionsModalConfig {
  private readonly translate = inject(TranslateService);

  public readonly config = signal({
    permissionsModal: {
      saveAction: this.translate.instant(
        'settings.approve-accounts.permissionsModal.saveAction',
      ),
      cancelAction: this.translate.instant(
        'settings.approve-accounts.permissionsModal.cancelAction',
      ),

      ofLabel: this.translate.instant(
        'settings.approve-accounts.permissionsModal.of',
      ),
      enabledSuffix: this.translate.instant(
        'settings.approve-accounts.permissionsModal.enabledSuffix',
      ),
    },
  });
}
