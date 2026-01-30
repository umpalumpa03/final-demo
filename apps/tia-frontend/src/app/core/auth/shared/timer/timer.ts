import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  interval,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer implements OnDestroy, OnInit {
  private destroy$ = new Subject<void>();
  public timeLimit = input(1);
  private timerSubscription?: Subscription;
  private tokenService = inject(TokenService);
  private router = inject(Router);

  public maxTime = computed(() => {
    const limit = Math.abs(Number(this.timeLimit()));

    return limit * 60;
  });

  private readonly CIRCUMFERENCE = 282.7;

  public countdown = signal<number>(0);
  private timer$ = interval(1000);

  public strokeOffset = computed(() => {
    const progress = this.countdown() / this.maxTime();
    return this.CIRCUMFERENCE * (1 - progress);
  });

  constructor() {
    effect(() => {
      this.countdown();
      if (this.countdown() === 0) {
        setTimeout(() => {
          this.tokenService.clearAllToken();
          this.router.navigate(['/auth/sign-in'])
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
