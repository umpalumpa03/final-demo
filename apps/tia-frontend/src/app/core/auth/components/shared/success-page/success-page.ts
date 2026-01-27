import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { interval, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-success-page',
  imports: [RouterLink, ButtonComponent, RouterLink],
  templateUrl: './success-page.html',
  styleUrl: './success-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessPage implements OnInit, OnDestroy{
  private router = inject(Router)
  private tokenService = inject(TokenService)
  private destroy$ = new Subject<void>();

  public countdown = signal<number>(10);
  private timer$ = interval(1000);

  constructor() {
    effect(() => {
      this.countdown();
      
      if (this.countdown() === 0) {
        this.tokenService.clearAllToken()
        console.log(this.tokenService.getSignUpToken)
        console.log(this.tokenService.verifyToken)
        this.router.navigate(['/auth/sign-in']);
      }
    });
  }

  ngOnInit() {
    this.startTimer();
    
  }

  private startTimer() {
    this.timer$.pipe(
      takeUntil(this.destroy$),
      takeWhile(() => this.countdown() > 0),
      tap((tick) => { 
          this.countdown.update((s) => s-1)
        }
      )
    ).subscribe()
  }


  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
