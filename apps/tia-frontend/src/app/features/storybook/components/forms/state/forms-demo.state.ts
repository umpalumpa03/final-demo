import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class FormsDemoState {
  private readonly translate = inject(TranslateService);

  public readonly pageInfo = signal({
    title: this.translate.instant('storybook.forms.formsTitle'),
    subtitle: this.translate.instant('storybook.forms.formsSubtitle'),
  });

  public readonly contactForm = signal({
    name: {
      label: this.translate.instant('storybook.forms.contact.form.name'),
      required: true,
      placeholder: 'Your Name',
    },
    email: {
      label: this.translate.instant('storybook.forms.contact.form.email'),
      required: true,
      placeholder: 'your.email@example.com',
    },
    message: {
      label: this.translate.instant('storybook.forms.contact.form.message'),
      required: true,
      placeholder: this.translate.instant(
        'storybook.forms.contact.form.messageInfo',
      ),
    },
    checkbox: {
      label: this.translate.instant('storybook.forms.contact.form.checkbox'),
      required: true,
    },
  });

  public readonly inlineForm = signal({
    message: {
      required: false,
      placeholder: 'jonh@example.com',
    },
  });

  public readonly rowForm = signal({
    firstName: {
      label: this.translate.instant('storybook.forms.row.firstName'),
      placeholder: 'Jhon',
    },
    lastName: {
      label: this.translate.instant('storybook.forms.row.lastName'),
      placeholder: 'Doe',
    },
    email: {
      label: this.translate.instant('storybook.forms.row.email'),
      placeholder: 'jonh@example.com',
    },
    phone: {
      label: this.translate.instant('storybook.forms.row.phone'),
      placeholder: '+1 (555) 000-0000',
    },
  });

  public readonly horizontalForm = signal({
    firstName: {
      placeholder: 'Jhon',
    },
    message: {
      placeholder: 'Doe',
    },
    email: {
      placeholder: 'jonh@example.com',
    },
  });

  public readonly stepForm = signal([
    { label: this.translate.instant('storybook.forms.step.from'), key: 'from' },
    { label: this.translate.instant('storybook.forms.step.to'), key: 'to' },
    {
      label: this.translate.instant('storybook.forms.step.amount'),
      key: 'amount',
    },
  ]);

  public readonly multiForm = signal({
    name: {
      label: this.translate.instant('storybook.forms.multi.name'),
      required: true,
      placeholder: 'Your Name',
    },
    bio: {
      label: this.translate.instant('storybook.forms.multi.bio'),
      required: true,
      placeholder: this.translate.instant('storybook.forms.multi.messageInfo'),
    },
  });

  public readonly planOptions = signal([
    {
      label: this.translate.instant('storybook.forms.planOptions.free'),
      value: 'free',
      description: this.translate.instant(
        'storybook.forms.planOptions.freeDesc',
      ),
      initialValue: true,
    },
    {
      label: this.translate.instant('storybook.forms.planOptions.pro'),
      value: 'pro',
      description: this.translate.instant(
        'storybook.forms.planOptions.proDesc',
      ),
    },
    {
      label: this.translate.instant('storybook.forms.planOptions.enterprise'),
      value: 'enterprise',
      description: this.translate.instant(
        'storybook.forms.planOptions.enterpriseDesc',
      ),
    },
  ]);

  public readonly validationForm = signal({
    success: {
      label: this.translate.instant('storybook.forms.validation.successLabel'),
      successMessage: this.translate.instant(
        'storybook.forms.validation.successMessage',
      ),
    },
    error: {
      label: this.translate.instant('storybook.forms.validation.errorLabel'),
      errorMessage: this.translate.instant(
        'storybook.forms.validation.errorMessage',
      ),
    },
    warning: {
      label: this.translate.instant('storybook.forms.validation.warningLabel'),
      warningMessage: this.translate.instant(
        'storybook.forms.validation.warningMessage',
      ),
    },
  });

  public readonly titles = signal({
    contact: this.translate.instant('storybook.forms.titles.contact'),
    registration: this.translate.instant('storybook.forms.titles.registration'),
    settings: this.translate.instant('storybook.forms.titles.settings'),
    inline: this.translate.instant('storybook.forms.titles.inline'),
    validation: this.translate.instant('storybook.forms.titles.validation'),
    multiStep: this.translate.instant('storybook.forms.titles.multiStep'),
    layout: this.translate.instant('storybook.forms.titles.layout'),
  });
}
