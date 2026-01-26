import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { TermsSection } from './models/dialog.model';
import { TERMS_AND_CONDITIONS } from './config/dialog.config';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
@Component({
  selector: 'app-large-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle],
  templateUrl: './large-dialog.html',
  styleUrl: './large-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LargeDialog {
  public isOpen = signal<boolean>(false);
  public readonly pageTitle = 'Terms and Conditions';
  public readonly pageSubtitle =
    'Please read and accept our terms and conditions.';
  public readonly sections: TermsSection[] = TERMS_AND_CONDITIONS;
  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
