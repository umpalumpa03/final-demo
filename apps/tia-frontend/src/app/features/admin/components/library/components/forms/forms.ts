import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactForms } from "./contact-forms/contact-forms";

@Component({
  selector: 'app-forms',
  imports: [ContactForms],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Forms {}
