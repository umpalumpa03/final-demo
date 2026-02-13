import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import {
  getModalBioInput,
  getModalUsernameInput,
} from '../edit-profile-dialog/config/inputs.config';
import { UiSheetModal } from '@tia/shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';

@Component({
  selector: 'app-right-sheet-demo',
  imports: [UiSheetModal, LibraryTitle, ButtonComponent, TextInput, Textarea, TranslatePipe],
  templateUrl: './right-sheet-demo.html',
  styleUrl: './right-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSheetDemo implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly sheetTitle = signal(this.translate.instant('storybook.overlays.rightSheet.title'));
  public readonly sheetSubtitle = signal(this.translate.instant('storybook.overlays.rightSheet.subtitle'));
  public readonly usernameInput = signal(getModalUsernameInput(this.translate));
  public readonly bioInput = signal(getModalBioInput(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.sheetTitle.set(this.translate.instant('storybook.overlays.rightSheet.title'));
      this.sheetSubtitle.set(this.translate.instant('storybook.overlays.rightSheet.subtitle'));
      this.usernameInput.set(getModalUsernameInput(this.translate));
      this.bioInput.set(getModalBioInput(this.translate));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
