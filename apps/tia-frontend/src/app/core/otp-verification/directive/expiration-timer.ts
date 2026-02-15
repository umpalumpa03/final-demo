import {
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subscription, tap } from 'rxjs';

@Directive({
  selector: '[appExpirationTimer]',
})
export class ExpirationTimer implements OnInit {
  private destroyRef = inject(DestroyRef);

  public maxTimer = input<number>(0);
  public expirationOutput = output<void>();

  private timer$ = interval(1000);
  public expireCountdown = signal<number>(0);
  private expirationTimer?: Subscription;

  constructor() {
    effect(() => {
      if (this.expireCountdown() === 0 && this.maxTimer() > 0) {
        this.expirationOutput.emit();
      }
    });
  }

  public ngOnInit(): void {
    this.startExpirationTimer(this.maxTimer());
  }

  private startExpirationTimer(timer: number) {
    if (this.expirationTimer) {
      this.expirationTimer.unsubscribe();
    }

    this.expireCountdown.set(timer);

    this.expirationTimer = this.timer$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.expireCountdown.update((sec) => sec - 1);
        }),
      )
      .subscribe();
  }
}
