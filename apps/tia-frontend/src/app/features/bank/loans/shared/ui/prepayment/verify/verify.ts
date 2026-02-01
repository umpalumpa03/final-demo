import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { VERIFY_LOAN } from '../../../config/loan-verify.config';
import { TranslatePipe } from '@ngx-translate/core';
import { Otp } from '@tia/shared/lib/forms/otp/otp';

@Component({
  selector: 'app-verify',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Otp,
    ButtonComponent,
    TranslatePipe,
  ],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify {
  private fb = inject(FormBuilder);

  public readonly isLoading = input<boolean>(false);

  public inputConfig = VERIFY_LOAN;

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
    this.verify.emit(this.form.controls.otp.value!);
  }
}
