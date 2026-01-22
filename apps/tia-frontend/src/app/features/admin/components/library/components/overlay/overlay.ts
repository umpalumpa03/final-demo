import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from './components/showcase-card/showcase-card';
import { EditProfileDialog } from './components/edit-profile-dialog/edit-profile-dialog';
import { FormDialog } from './components/form-dialog/form-dialog';
import { LargeDialog } from './components/large-dialog/large-dialog';
import { DeleteAccountDialog } from "./components/delete-account-dialog/delete-account-dialog";

@Component({
  selector: 'app-overlay',
  imports: [
    LibraryTitle,
    ShowcaseCard,
    EditProfileDialog,
    FormDialog,
    LargeDialog,
    DeleteAccountDialog
],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overlay {
  public pageTitle = 'Overlay Components';
  public pageSubtitle = 'Modal dialogs, sheets, popovers, and dropdown menu';

  public isDeleteAlertOpen = signal<boolean>(false);
  public isConfirmAlertOpen = signal<boolean>(false);
  public isRightSheetOpen = signal<boolean>(false);
  public isLeftSheetOpen = signal<boolean>(false);
  public isTopSheetOpen = signal<boolean>(false);
  public isBottomSheetOpen = signal<boolean>(false);
  public isDrawerOpen = signal<boolean>(false);

  public toggle(state: WritableSignal<boolean>): void {
    state.update((current) => !current);
  }

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
