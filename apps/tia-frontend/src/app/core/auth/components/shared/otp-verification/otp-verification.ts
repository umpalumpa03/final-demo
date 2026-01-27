import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../../services/auth.service';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';

@Component({
  selector: 'app-otp-verification',
  imports: [TextInput, ReactiveFormsModule, ButtonComponent, Spinner],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public isLoading = computed(() => this.authService.isLoginLoading());

  public otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern('^\\d*$')]],
  });

  public verifyOtp(): void {
    this.authService
      .verifyMfa({
        ...this.otpForm.getRawValue(),
        challengeId: this.authService.getChallengeId(),
      })
      .subscribe();
  }
}
