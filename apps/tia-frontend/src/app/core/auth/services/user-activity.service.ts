import { inject, Injectable, NgZone, signal } from "@angular/core";
import { fromEvent, merge, Observable, Subject, throttleTime } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserActivityService {
    private zone = inject(NgZone);
    private idle = signal(false);
    private idleTimeout = 5 * 60 * 1000;
    private idleTimer: any;
    private lastActivity = Date.now();

    private idleSubject = new Subject<boolean>();
    public idle$ = this.idleSubject.asObservable();

   constructor() {
    this.zone.runOutsideAngular(() => {
      const activity$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click'),
        fromEvent(document, 'scroll'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'touchmove')
      ).pipe(throttleTime(1000));

      activity$.subscribe(() => {
        this.zone.run(() => {
          if (this.idle()) {
            this.idle.set(false);
            this.idleSubject.next(false);
          }
        });
        this.resetTimer();
      });
    });
  }

  private resetTimer() {
    this.lastActivity = Date.now();

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      this.zone.run(() => {
        this.idle.set(true);
        this.idleSubject.next(true);
      });
    }, this.idleTimeout);
  }

  public startMonitoring(): void {
    this.resetTimer();
  }

  public stopMonitoring(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  public setIdleTimeout(minutes: number): void {
    this.idleTimeout = minutes * 60 * 1000;
    if (this.idleTimer) {
      this.resetTimer();
    }
  }

  public getIdleStatus(): boolean {
    return this.idle();
  }

  public getLastActivity(): number {
    return this.lastActivity;
  }

  public getTimeUntilIdle(): number {
    return Math.max(0, this.idleTimeout - (Date.now() - this.lastActivity));
  }
}