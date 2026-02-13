import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiModal } from '../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { LibraryTitle } from "../../../../shared/library-title/library-title";

@Component({
  selector: 'app-confirm-account-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TranslatePipe],
  templateUrl: './confirm-account-dialog.html',
  styleUrl: './confirm-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountDialog implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly confirmTitle = signal(this.translate.instant('storybook.overlays.confirmAccount.title'));
  public readonly confirmSubtitle = signal(this.translate.instant('storybook.overlays.confirmAccount.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.confirmTitle.set(this.translate.instant('storybook.overlays.confirmAccount.title'));
      this.confirmSubtitle.set(this.translate.instant('storybook.overlays.confirmAccount.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
