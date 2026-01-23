import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-inline-form',
  imports: [TextInput, ButtonComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './inline-form.html',
  styleUrl: './inline-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineForm {
  private fb = inject(FormBuilder);
  public submitInlineForm = output<string>();

  public inlineForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public submit() {
    if (this.inlineForm.invalid) {
      this.inlineForm.markAllAsTouched();
      return;
    }

    this.submitInlineForm.emit(this.inlineForm.getRawValue().email);
    this.inlineForm.reset();
  }

  //this is temporary configs
  public readonly emailConfigs = {
    required: false,
    placeholder: 'jonh@example.com',
  } as const;
}
