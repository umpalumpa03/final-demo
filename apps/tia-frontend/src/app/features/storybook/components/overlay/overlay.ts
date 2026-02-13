import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { FormDialog } from './components/form-dialog/form-dialog';
import { LargeDialog } from './components/large-dialog/large-dialog';
import { DeleteAccountDialog } from './components/delete-account-dialog/delete-account-dialog';
import { ConfirmAccountDialog } from './components/confirm-account-dialog/confirm-account-dialog';
import { RightSheetDemo } from "./components/right-sheet-demo/right-sheet-demo";
import { LeftSheetDemo } from "./components/left-sheet-demo/left-sheet-demo";
import { TopSheetModal } from "./components/top-sheet-modal/top-sheet-modal";
import { BottomSheetModal } from "./components/bottom-sheet-modal/bottom-sheet-modal";
import { DrawerModal } from "./components/drawer-modal/drawer-modal";
import { ContextDemo } from "./components/context-demo/context-demo";
import { CommandPaletteDemo } from "./components/command-palette-demo/command-palette-demo";

@Component({
  selector: 'app-overlay',
  imports: [
    LibraryTitle,
    ShowcaseCard,
    EditProfileDialog,
    FormDialog,
    LargeDialog,
    DeleteAccountDialog,
    ConfirmAccountDialog,
    RightSheetDemo,
    LeftSheetDemo,
    TopSheetModal,
    BottomSheetModal,
    DrawerModal,
    ContextDemo,
    CommandPaletteDemo,
],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overlay implements OnInit {
  private readonly translate = inject(TranslateService);

  public readonly pageTitle = signal(this.translate.instant('storybook.overlays.title'));
  public readonly pageSubtitle = signal(this.translate.instant('storybook.overlays.subtitle'));
  public readonly sectionDialogs = signal(this.translate.instant('storybook.overlays.sections.dialogs'));
  public readonly sectionAlertDialogs = signal(this.translate.instant('storybook.overlays.sections.alertDialogs'));
  public readonly sectionSheets = signal(this.translate.instant('storybook.overlays.sections.sheets'));
  public readonly sectionDrawers = signal(this.translate.instant('storybook.overlays.sections.drawers'));
  public readonly sectionCommandPalette = signal(this.translate.instant('storybook.overlays.sections.commandPalette'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.pageTitle.set(this.translate.instant('storybook.overlays.title'));
      this.pageSubtitle.set(this.translate.instant('storybook.overlays.subtitle'));
      this.sectionDialogs.set(this.translate.instant('storybook.overlays.sections.dialogs'));
      this.sectionAlertDialogs.set(this.translate.instant('storybook.overlays.sections.alertDialogs'));
      this.sectionSheets.set(this.translate.instant('storybook.overlays.sections.sheets'));
      this.sectionDrawers.set(this.translate.instant('storybook.overlays.sections.drawers'));
      this.sectionCommandPalette.set(this.translate.instant('storybook.overlays.sections.commandPalette'));
    });
  }
}
