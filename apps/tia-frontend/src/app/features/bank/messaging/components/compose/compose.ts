import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { MessagingStore } from '../../store/messaging.store';
import { User } from '../../store/messaging.state';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailChipsInput } from '../../shared/ui/email-chips-input/email-chips-input';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Checkboxes } from "@tia/shared/lib/forms/checkboxes/checkboxes";
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { Store } from '@ngrx/store';
import { userInfoFeature } from 'apps/tia-frontend/src/app/store/user-info/user-info.reducer';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-compose',
  imports: [UiModal, ReactiveFormsModule, EmailChipsInput, TextInput, Textarea, ButtonComponent, Checkboxes, AlertTypesWithIcons, TranslatePipe],
  templateUrl: './compose.html',
  styleUrl: './compose.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Compose {
  private readonly fb = inject(FormBuilder);
  public readonly close = output<void>();
  public readonly isOpen = input.required<boolean>();
  public readonly invalidForm = signal<boolean>(false);
  public readonly errorMesage = signal<string>('');
  public readonly store = inject(MessagingStore);
  public readonly roleStore = inject(Store);
  private readonly breakpointService = inject(BreakpointService);
  public readonly isExtraSmall = this.breakpointService.isExtraSmall;

  public readonly filteredSearchResultsCc = computed(() => {
    const selectedEmails = [
      this.toEmail(),
      ...this.ccEmails()
    ].filter(Boolean);

    return this.store.searchResults().filter(
      user => !selectedEmails.includes(user.email)
    );
  });

  public readonly filteredSearchResults = computed(() => {
    const selectedEmails = this.ccEmails().filter(Boolean);

    return this.store.searchResults().filter(
      user => !selectedEmails.includes(user.email)
    );
  });

  public readonly form = this.fb.group({
    subject: ['', Validators.required],
    body: ['', Validators.required],
    isImportant: [false],
  });

  public readonly role = this.roleStore.selectSignal(
    userInfoFeature.selectRole,
  );

  @ViewChild('toInput') toInput!: EmailChipsInput;
  @ViewChild('ccInput') ccInput!: EmailChipsInput;

  public isInvalidCcEmail = false;
  public isInvalidToEmail = false;

  public onInvalidCcEmail(isInvalid: boolean) {
    this.isInvalidCcEmail = isInvalid;
  }
  public onInvalidToEmail(isInvalid: boolean) {
    this.isInvalidToEmail = isInvalid;
  }

  public readonly toEmail = signal<string>('');
  public readonly ccEmails = signal<string[]>([]);

  public onSearchEmails(query: string): void {
    this.store.searchMails(query);
  }

  public onToEmailSelected(user: User): void {
    this.toEmail.set(user.email);
  }

  public onCcEmailSelected(user: User): void {
    const emails = this.ccEmails();
    if (!emails.includes(user.email)) {
      this.ccEmails.set([...emails, user.email]);
    }
  }

  public onCcEmailRemoved(email: string): void {
    this.ccEmails.set(this.ccEmails().filter((e) => e !== email));
  }

  private submitEmail(isDraft: boolean): void {
    if (this.isInvalidToEmail || this.isInvalidCcEmail) {
      this.invalidForm.set(true);
      this.errorMesage.set('Please select valid email addresses from the suggestions.');
      setTimeout(() => {
        this.invalidForm.set(false);
      }, 4000);
      return;
    }

    const toEmail = this.toEmail();
    if (!toEmail) {
      this.invalidForm.set(true);
      setTimeout(() => {
        this.invalidForm.set(false);
      }, 4000);
      this.errorMesage.set('Recipient email is required.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.invalidForm.set(true);
      setTimeout(() => {
        this.invalidForm.set(false);
      }, 4000);
      this.errorMesage.set('Please fill in subject and message.');
      return;
    }

    const formValue = this.form.value;

    this.store.sendEmail({
      recipient: toEmail,
      ccRecipients: this.ccEmails(),
      subject: formValue.subject!,
      body: formValue.body!,
      isImportant: formValue.isImportant || false,
      isDraft,
    });

    this.invalidForm.set(false);
    this.resetForm();
    this.close.emit();
  }

  public onSendEmail(): void {
    this.submitEmail(false);
  }

  public onSaveDraft(): void {
    this.submitEmail(true);
  }

  public onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  private resetForm(): void {
    this.form.reset({
      subject: '',
      body: '',
      isImportant: false,
    });

    this.toInput?.reset();
    this.ccInput?.reset();
    this.toEmail.set('');
    this.ccEmails.set([]);
  }
}
