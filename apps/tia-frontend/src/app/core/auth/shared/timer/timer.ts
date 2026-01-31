import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  interval,
  Subject,
  Subscription,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { TimerType } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { OtpResponse } from '../../models/authRequest.models';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer implements OnDestroy, OnInit {
  public timeLimit = input(1);
  public timerType = input<TimerType>('phone');

  private destroy$ = new Subject<void>();
  private timerSubscription?: Subscription;
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public maxTime = computed(() => {
    const limit = Math.abs(Number(this.timeLimit()));

    return limit * 6;
  });

  public countdown = signal<number>(0);
  private timer$ = interval(1000);

  public isResendActive = signal<boolean>(false);
  public resendText = input<string>('');

  public timerFinished = output<boolean>();
  public resendClicked = output<void>();

  constructor() {
    effect(() => {
      this.countdown();
      if (this.countdown() === 0) {
        setTimeout(() => {
          if (this.timerType() === 'phone') {
            this.handlePhoneTimer();
          } else {
            this.handleOtpTimer();
          }
        }, 1000);
      }
    });
  }

  public ngOnInit() {
    this.countdown.set(this.maxTime());
    this.startTimer();
  }

  private startTimer() {
    this.timerSubscription = this.timer$
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.countdown() > 0),
        tap(() => {
          this.countdown.update((s) => s - 1);
        }),
      )
      .subscribe();
  }

  private handlePhoneTimer() {
    this.tokenService.clearAllToken();
    this.router.navigate(['/auth/sign-in']);
  }

  private handleOtpTimer() {
    this.isResendActive.set(true);
    this.timerFinished.emit(true);
  }

  public handleOtpResend() {
    if (this.countdown() > 0) {
      return;
    }
    this.resendClicked.emit();
    // 
    this.countdown.set(this.maxTime());
    this.startTimer();
    // 
    // this.authService
    //   .resendVerificationCode()
    //   .pipe(
    //     take(1),
    //     tap(() => {
    //       this.countdown.set(this.maxTime());
    //       this.startTimer();
    //     }),
    //   )
    //   .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
