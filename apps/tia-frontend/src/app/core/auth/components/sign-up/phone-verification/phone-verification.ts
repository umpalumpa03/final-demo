import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule],
  templateUrl: './phone-verification.html',
  styleUrl: './phone-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneVerification {

  private authService = inject(AuthService)

  public phoneNumber = new FormControl('', { nonNullable: true });

  submit() {
    console.log(this.phoneNumber.value, "___VAL");
    let telNumber = this.phoneNumber.value!
    this.authService.sendVerificationCode(telNumber).pipe(
      tap((res)=>{
        console.log(res, "__RES")
      })
    ).subscribe()
  }
}
