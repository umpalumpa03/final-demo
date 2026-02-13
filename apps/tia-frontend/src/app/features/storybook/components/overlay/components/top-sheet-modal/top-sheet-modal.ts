import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { UiSheetModal } from '@tia/shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';

@Component({
  selector: 'app-top-sheet-modal',
  imports: [UiSheetModal, LibraryTitle, ButtonComponent, TranslatePipe],
  templateUrl: './top-sheet-modal.html',
  styleUrl: './top-sheet-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopSheetModal implements OnInit {
  private readonly translate = inject(TranslateService);

  public readonly modalTitle = signal(this.translate.instant('storybook.overlays.topSheet.title'));
  public readonly modalSubtitle = signal(this.translate.instant('storybook.overlays.topSheet.subtitle'));
  public readonly modalMessage = signal(this.translate.instant('storybook.overlays.topSheet.message'));
  public isOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.modalTitle.set(this.translate.instant('storybook.overlays.topSheet.title'));
      this.modalSubtitle.set(this.translate.instant('storybook.overlays.topSheet.subtitle'));
      this.modalMessage.set(this.translate.instant('storybook.overlays.topSheet.message'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
