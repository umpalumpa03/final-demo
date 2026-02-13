import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  getModalEmailInput,
  getModalNameInput,
} from './config/inputs.config';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TextInput, TranslatePipe],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialog implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly profileTitle = signal(this.translate.instant('storybook.overlays.editProfile.title'));
  public readonly profileSubtitle = signal(this.translate.instant('storybook.overlays.editProfile.subtitle'));
  public readonly nameInput = signal(getModalNameInput(this.translate));
  public readonly emailInput = signal(getModalEmailInput(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.profileTitle.set(this.translate.instant('storybook.overlays.editProfile.title'));
      this.profileSubtitle.set(this.translate.instant('storybook.overlays.editProfile.subtitle'));
      this.nameInput.set(getModalNameInput(this.translate));
      this.emailInput.set(getModalEmailInput(this.translate));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
