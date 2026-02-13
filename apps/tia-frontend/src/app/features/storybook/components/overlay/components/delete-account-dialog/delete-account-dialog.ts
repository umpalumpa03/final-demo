import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiModal } from '../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from "../../../../shared/library-title/library-title";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-delete-account-dialog',
  imports: [UiModal, LibraryTitle, ButtonComponent, TranslatePipe],
  templateUrl: './delete-account-dialog.html',
  styleUrl: './delete-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialog implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly dialogTitle = signal(this.translate.instant('storybook.overlays.deleteAccount.title'));
  public readonly dialogSubtitle = signal(this.translate.instant('storybook.overlays.deleteAccount.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.dialogTitle.set(this.translate.instant('storybook.overlays.deleteAccount.title'));
      this.dialogSubtitle.set(this.translate.instant('storybook.overlays.deleteAccount.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
