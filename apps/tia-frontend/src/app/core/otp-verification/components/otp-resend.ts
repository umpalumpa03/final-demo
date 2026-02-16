import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, interval, Subscription, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'app-otp-resend',
  imports: [TranslatePipe],
  templateUrl: './otp-resend.html',
  styleUrl: './otp-resend.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpResend implements OnInit {
  private destroyRef = inject(DestroyRef);
  private timer$ = interval(1000);
  private resendTimer?: Subscription;

  public maxTimeoutMs = input<number>(0);
  public resendRetries = input<number>(0);
  public timerType = input<'phone' | 'otp'>('otp');

  public resendClicked = output<void>();
  public timeoutReached = output<void>();
  public noMoreAttempts = output<void>();

  public countdown = signal<number>(0);
  public isResendActive = signal<boolean>(false);
  public resendRetriesCount = signal<number>(0);

  public maxTime = computed(() => this.maxTimeoutMs() / 1000);

  public canResend = computed(
    () => this.countdown() === 0 && this.resendRetriesCount() > 0,
  );

  constructor() {
    effect(() => {
      const time = this.maxTime();
      if (time > 0) {
        this.startResendTimer(time);
      }
    });

    effect(() => {
      if (this.resendRetriesCount() === 0 && this.countdown() === 0) {
        this.noMoreAttempts.emit();
      }
    });
  }

  public ngOnInit(): void {
    this.resendRetriesCount.set(this.resendRetries());
  }

  private startResendTimer(seconds: number): void {
    if (this.resendTimer) {
      this.resendTimer.unsubscribe();
    }

    this.countdown.set(seconds);
    this.isResendActive.set(false);

    this.resendTimer = this.timer$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        takeWhile(() => this.countdown() > 0),
        tap(() => this.countdown.update((sec) => sec - 1)),
        finalize(() => {
          this.isResendActive.set(true);
          this.timeoutReached.emit();
        }),
      )
      .subscribe();
  }

  public onResend(): void {
    if (!this.canResend()) return;

    this.resendRetriesCount.update((retry) => retry - 1);

    this.resendClicked.emit();
    this.startResendTimer(this.maxTime());
  }
}
