import { Injectable, inject } from '@angular/core';
import { fromEvent, merge, BehaviorSubject, timer, Subscription } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class MonitorInactivity {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);

  private idleTime$ = new BehaviorSubject<number>(10000);
  private inactivitySubscription: Subscription | null = null;

  private activity$ = merge(
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'scroll'),
    fromEvent(document, 'touchstart'),
  );

  public readonly inactivity$ = this.idleTime$.pipe(
    switchMap((idleTime) =>
      this.activity$.pipe(
        startWith(null),
        switchMap(() =>
          timer(idleTime).pipe(
            map(() => true),
            startWith(false),
          ),
        ),
      ),
    ),
    filter(() => !!this.tokenService.accessToken),
    tap((isInactive) => {
      if (isInactive) {
        this.authService.logout().subscribe();
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public start(idleTime: number): void {
    this.idleTime$.next(idleTime);
    this.subscribeActivity();
  }

  public subscribeActivity(): void {
    if (!this.inactivitySubscription) {
      this.inactivitySubscription = this.inactivity$.subscribe();
    }
  }

  public unsubscribeActivity(): void {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      this.inactivitySubscription = null;
    }
  }
}
