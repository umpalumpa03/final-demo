import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';

@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule, TextInput, ButtonComponent],
  templateUrl: './phone-verification.html',
  styleUrl: './phone-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerification implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public setPhoneNumberForm = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
  });
  
  public ngOnInit(): void {
    
  }

  public errorMessage = signal<string>('');

  public submit(): void {
    let telNumber = this.setPhoneNumberForm.getRawValue().phoneNumber;
    this.authService
      .sendPhoneVerificationCode(telNumber)
      .pipe(
        tap((res) => {
          this.errorMessage.set('');
          this.authService.setChellangeId(res.challengeId);
          this.router.navigate(['/auth/otp']);
        }),
        catchError((err) => {
          const messages = err.error?.message;
          console.log(messages, '__FAIL');
          this.errorMessage.set(messages);

          return EMPTY;
        }),
      )
      .subscribe();
  }
}