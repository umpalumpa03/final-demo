import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  getModalDescriptionInput,
  getModalNameInput,
} from '../edit-profile-dialog/config/inputs.config';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-form-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TextInput, Textarea, TranslatePipe],
  templateUrl: './form-dialog.html',
  styleUrl: './form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialog implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal(false);
  public readonly projectNameInput = signal(getModalNameInput(this.translate));
  public readonly projectDescriptionInput = signal(getModalDescriptionInput(this.translate));
  public readonly projectTitle = signal(this.translate.instant('storybook.overlays.formDialog.title'));
  public readonly projectSubtitle = signal(this.translate.instant('storybook.overlays.formDialog.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.projectNameInput.set(getModalNameInput(this.translate));
      this.projectDescriptionInput.set(getModalDescriptionInput(this.translate));
      this.projectTitle.set(this.translate.instant('storybook.overlays.formDialog.title'));
      this.projectSubtitle.set(this.translate.instant('storybook.overlays.formDialog.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
