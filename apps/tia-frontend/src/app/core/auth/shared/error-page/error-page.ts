import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPage {
  private router = inject(Router);
  public timer = signal(5);

  constructor() {
    this.startTimer();
  }

  private startTimer(): void {
    const interval = setInterval(() => {
      this.timer.update((value) => value - 1);

      if (this.timer() <= 0) {
        clearInterval(interval);
        this.router.navigate(['/auth/sign-in']);
      }
    }, 1000);
  }
}
