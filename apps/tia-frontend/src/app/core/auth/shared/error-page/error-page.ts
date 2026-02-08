import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '../../models/tokens.model';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
  private router = inject(Router);
  public timer = signal(3);
  public redirectUrl = input<string>();
  public redirectText = input<string>();

  constructor() {
    this.startTimer();
  }

  private startTimer(): void {
    const interval = setInterval(() => {
      this.timer.update((value) => value - 1);

      if (this.timer() <= 0) {
        clearInterval(interval);
        this.router.navigate([this.redirectUrl() || Routes.SIGN_IN]);
      }
    }, 1000);
  }
}
