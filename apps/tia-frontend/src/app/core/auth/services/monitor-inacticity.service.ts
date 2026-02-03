import { Injectable, inject, signal, computed } from '@angular/core';
import { fromEvent, merge, BehaviorSubject, timer } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  shareReplay,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class MonitorInactivity {
  private tokenService = inject(TokenService);

  private totalInactivityTime$ = new BehaviorSubject<number>(600000);
  private inactivityThreshold = 5000;
  private warningThreshold = 60;

  private _timeleft = signal<number>(0);
  public readonly timeleft = this._timeleft.asReadonly();

  public readonly timeWarning = computed(() => {
    const timeLeft = this.timeleft();
    return timeLeft > 0 && timeLeft <= this.warningThreshold ? timeLeft : 0;
  });

  private activity$ = merge(
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'scroll'),
    fromEvent(document, 'touchstart'),
  ).pipe(
    debounceTime(500),
    tap(() => {
      this._timeleft.set(0);
    }),
  );

  public readonly inactivity$ = this.totalInactivityTime$.pipe(
    switchMap((inactiveTime) =>
      this.activity$.pipe(
        debounceTime(this.inactivityThreshold),
        filter(() => {
          const hasToken = !!this.tokenService.accessToken;
          return hasToken;
        }),
        switchMap(() =>
          timer(0, 1000).pipe(
            map((second) =>
              Math.max(0, Math.ceil(inactiveTime / 1000) - second),
            ),
            takeWhile((timeLeft) => timeLeft >= 0, true),
            takeUntil(this.activity$),
            tap((timeLeft) => {
              this._timeleft.set(timeLeft);
              if (timeLeft === 0) {
              }
            }),
            map((timeLeft) => (timeLeft === 0 ? true : timeLeft)),
          ),
        ),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
