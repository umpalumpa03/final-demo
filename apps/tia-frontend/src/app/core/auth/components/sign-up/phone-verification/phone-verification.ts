import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';

@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule, TextInput ,ButtonComponent],
  templateUrl: './phone-verification.html',
  styleUrl: './phone-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerification {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)
  private tokenService = inject(TokenService)

  public setPhoneNumberForm = this.fb.nonNullable.group({
    phoneNumber: [ '',[Validators.required],
    ],
  });

  public errorMessage = signal<string>('') 

  public submit():void {
    let telNumber = this.setPhoneNumberForm.getRawValue().phoneNumber;
    this.authService
      .sendVerificationCode(telNumber)
      .pipe(
        tap((res) => {
          this.errorMessage.set('')
          // Challenge id localStorage 🚩🚩
          this.tokenService.setChallengeId(res.challengeId)
          this.router.navigate(['/auth/sign-up/otp-verify']);

        }),
        catchError((err) => {
          const messages = err.error?.message;

          this.errorMessage.set(messages[0]);

          return EMPTY;
        }),
      )
      .subscribe();
  }
}
