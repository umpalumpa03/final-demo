import { Component, inject } from '@angular/core';
import { TokenService } from '../../../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  imports: [],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
})
export class OtpVerification {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  ngOnInit() {
    // Defaultad Verifikaciis Gareshe
    setTimeout(() => {
      this.tokenService.clearSignUpToken();
      this.router.navigate(['/auth/sign-up']);
    }, 600000);
  }
}
