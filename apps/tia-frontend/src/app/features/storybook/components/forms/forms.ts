import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from './contact-form/contact-form';
import { RegistrationForm } from './registration-form/registration-form';
import { InlineForm } from './inline-form/inline-form';
import { ValidationForm } from './validation-form/validation-form';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { LayoutForm } from './layout-form/layout-form';
import { SettingsForm } from './settings-form/settings-form';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { MultistepForms } from "./multistep-form/multistep-forms";
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-forms',
  imports: [
    ContactForms,
    RegistrationForm,
    InlineForm,
    ValidationForm,
    LibraryTitle,
    LayoutForm,
    SettingsForm,
    ShowcaseCard,
    MultistepForms,
    Skeleton
],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forms {
  public readonly title = 'Forms';
  public readonly subtitle =
    'Complete form examples with various input types and layouts';
}
