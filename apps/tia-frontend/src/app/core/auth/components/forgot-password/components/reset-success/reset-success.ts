import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-reset-success',
  imports: [],
  templateUrl: './reset-success.html',
  styleUrl: './reset-success.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetSuccess implements OnInit, OnDestroy {
  public readonly countdown = signal(5);
  private timerId: number | null = null;
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.countdown.update((value) => {
        const next = value - 1;
        if (next <= 0) {
          this.redirectToLogin();
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
  }

  async redirectToLogin(): Promise<void> {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    // this.authService.clearForgotPasswordState();
    await this.router.navigate(['/auth/sign-in']);
  }
}
