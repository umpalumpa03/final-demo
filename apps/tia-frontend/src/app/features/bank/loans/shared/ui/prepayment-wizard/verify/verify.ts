import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, ReactiveFormsModule, TextInput, ButtonComponent],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify {
  private fb = inject(FormBuilder);

  public cancel = output<void>();
  public verify = output<string>();

  public form = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]],
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Emit the OTP value to the parent
    this.verify.emit(this.form.controls.otp.value!);
  }
}
