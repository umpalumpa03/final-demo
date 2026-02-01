import { Directive, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export class UserManagamentState {
  private readonly translate = inject(TranslateService);

  public newConfig = signal({
    title: this.translate.instant('settings.user-management.title'),
    subtitle: this.translate.instant('settings.user-management.subtitle'),
    placeholder: this.translate.instant('settings.user-management.placeholder'),
  });
}
