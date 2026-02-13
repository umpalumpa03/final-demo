import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getQuickActions } from './config/navigation.config';
import { UiSheetModal } from '../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { BottomActionCard } from './components/bottom-action-card/bottom-action-card';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-bottom-sheet-modal',
  imports: [UiSheetModal, BottomActionCard, LibraryTitle, ButtonComponent, TranslatePipe],
  templateUrl: './bottom-sheet-modal.html',
  styleUrl: './bottom-sheet-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetModal implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly navConfig = signal(getQuickActions(this.translate));
  public readonly sheetTitle = signal(this.translate.instant('storybook.overlays.bottomSheet.title'));
  public readonly sheetSubtitle = signal(this.translate.instant('storybook.overlays.bottomSheet.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.navConfig.set(getQuickActions(this.translate));
      this.sheetTitle.set(this.translate.instant('storybook.overlays.bottomSheet.title'));
      this.sheetSubtitle.set(this.translate.instant('storybook.overlays.bottomSheet.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
