import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { IVerified } from '@tia/core/otp-verification/models/otp-verification.models';
import { LoanVerifyState } from '../../../state/loan-verify.state';
import { LOANS_ROUTES } from '../../../config/loans-redirect.config';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, OtpVerification],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
  providers: [LoanVerifyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verify {
  private readonly router = inject(Router);
  public readonly verifyState = inject(LoanVerifyState);
  public readonly isLoading = input<boolean>(false);

  public readonly errorMessage = input<string | null>(null);
  public readonly routes = LOANS_ROUTES;

  public readonly cancel = output<void>();
  public readonly verify = output<string>();
  public readonly resend = output<void>();

  public readonly closeModal = output<void>();

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
        tap(() => this.closeModal.emit()),
      )
      .subscribe();
  }

  public onVerify(event: IVerified): void {
    if (event.otp) {
      this.verify.emit(event.otp);
    }
  }
}
