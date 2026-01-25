import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IHorizontalLayout } from '../../models/contact-forms.model';
import { HORIZONTAL_FORM } from '../../models/forms.config';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";
import { Textarea } from "@tia/shared/lib/forms/textarea/textarea";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-horizontal-layout',
  imports: [TextInput, Textarea, ButtonComponent, ReactiveFormsModule],
  templateUrl: './horizontal-layout.html',
  styleUrl: './horizontal-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalLayout {
  private readonly fb = inject(FormBuilder);
  public horizontalConfigs = HORIZONTAL_FORM;
  public readonly horizontalLayoutForm = output<IHorizontalLayout>();

  public horizontalForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  public submitHorizontalLayout(): void {
    if (this.horizontalForm.invalid || !this.horizontalForm.value) {
      this.horizontalForm.markAllAsTouched();
      return;
    }

    this.horizontalLayoutForm.emit(this.horizontalForm.getRawValue());
    this.horizontalForm.reset();
  }
}
