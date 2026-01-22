import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { FormDialog } from './components/form-dialog/form-dialog';
import { LargeDialog } from './components/large-dialog/large-dialog';
import { DeleteAccountDialog } from './components/delete-account-dialog/delete-account-dialog';
import { ConfirmAccountDialog } from './components/confirm-account-dialog/confirm-account-dialog';
import { RightSheetDemo } from "./components/right-sheet-demo/right-sheet-demo";

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
    RightSheetDemo
],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overlay {
  public pageTitle = 'Overlay Components';
  public pageSubtitle = 'Modal dialogs, sheets, popovers, and dropdown menu';
}
