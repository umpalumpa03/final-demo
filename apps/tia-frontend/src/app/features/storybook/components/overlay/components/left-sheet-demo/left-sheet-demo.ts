import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getNavItems } from './configs/item.config';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { UiSheetModal } from '@tia/shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';

@Component({
  selector: 'app-left-sheet-demo',
  imports: [UiSheetModal, LibraryTitle, ButtonComponent, TranslatePipe],
  templateUrl: './left-sheet-demo.html',
  styleUrl: './left-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSheetDemo implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public libraryNavItems = signal(getNavItems(this.translate));
  public readonly sheetTitle = signal(this.translate.instant('storybook.overlays.leftSheet.title'));
  public readonly sheetSubtitle = signal(this.translate.instant('storybook.overlays.leftSheet.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.libraryNavItems.set(getNavItems(this.translate));
      this.sheetTitle.set(this.translate.instant('storybook.overlays.leftSheet.title'));
      this.sheetSubtitle.set(this.translate.instant('storybook.overlays.leftSheet.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
