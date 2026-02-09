import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-inline-form',
  imports: [TextInput, ButtonComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './inline-form.html',
  styleUrl: './inline-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineForm {
  private fb = inject(FormBuilder);
  public submitInlineForm = output<string>();
  public readonly emailConfigs = inject(FormsDemoState).inlineForm;

  public inlineForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public submit(): void {
    if (this.inlineForm.invalid) {
      this.inlineForm.markAllAsTouched();
      return;
    }

    this.submitInlineForm.emit(this.inlineForm.getRawValue().email);
    this.inlineForm.reset();
  }
}
