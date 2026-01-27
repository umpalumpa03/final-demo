import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  imports: [ButtonComponent, TextInput, ReactiveFormsModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  public errorMessage = signal<string>('') 
  
  private registerVerifyLogic = signal<boolean>(true);
  
  // Mock Version got code length:4, In task: 6
  public smsCodeVerificationForm = this.fb.nonNullable.group({
    verificationCode: [ '',[Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  ngOnInit() { 
    const path = this.route.snapshot.url[0].path; 
    console.log(path)
    if (path === 'sign-in') {
      this.registerVerifyLogic.set(false);
    } else if(path === 'sign-up') {
      this.registerVerifyLogic.set(true)
    }
  }

  public submit(): void {
    if(this.registerVerifyLogic()) {
      this.registerVerification()
    } else {
      console.log("LOGIN Logic")
    }
  }

  private registerVerification():void {
    if (this.smsCodeVerificationForm.invalid) {
      this.smsCodeVerificationForm.markAllAsTouched();
      return;
    }

    const { verificationCode } = this.smsCodeVerificationForm.getRawValue();

    this.authService.verifyOtpCode(verificationCode).pipe(
      tap((res)=>{
        console.log(res)
        this.router.navigate(['/auth/sign-up/success']);
      }),
      catchError((err) => {
        this.errorMessage.set(err)
        console.log(err, "__ERR")
        return EMPTY
      })
    ).subscribe()
  }
}
