import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApproveCardsState {
  private readonly translate = inject(TranslateService);

  public newConfig = signal({
    title: this.translate.instant('settings.approve-cards.title'),
    subtitle: this.translate.instant('settings.approve-cards.subtitle'),
  });
}
