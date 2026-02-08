import { Injectable, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import {
  AlertType,
  AlertVariant,
  AlertOptions,
  DEFAULT_AUTO_HIDE,
} from '@tia/shared/lib/alerts/shared/models/alert.models';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly router = inject(Router);

  private alertKind = signal<AlertType | null>(null);
  private alertMessageText = signal<string>('');
  private alertTitleText = signal<string>('');
  private alertVariantType = signal<AlertVariant>('standard');
  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public readonly alertType = computed<AlertType | null>(() => this.alertKind());
  public readonly alertMessage = computed<string>(() => this.alertMessageText());
  public readonly alertTitle = computed<string>(() => this.alertTitleText());
  public readonly alertVariant = computed<AlertVariant>(() => this.alertVariantType());
  public readonly isVisible = computed<boolean>(() => this.alertKind() !== null);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.clearAlert());
  }

  public success(message: string, options?: AlertOptions): void {
    this.showAlert('success', message, options);
  }

  public error(message: string, options?: AlertOptions): void {
    this.showAlert('error', message, options);
  }

  public warning(message: string, options?: AlertOptions): void {
    this.showAlert('warning', message, options);
  }

  public info(message: string, options?: AlertOptions): void {
    this.showAlert('information', message, options);
  }

  public showAlert(kind: AlertType, message: string, options?: AlertOptions): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }

    const autoHideMs = options?.autoHideMs ?? DEFAULT_AUTO_HIDE[kind];

    this.alertKind.set(kind);
    this.alertMessageText.set(message);
    this.alertTitleText.set(options?.title ?? '');
    this.alertVariantType.set(options?.variant ?? 'standard');

    this.alertTimeoutId = setTimeout(() => {
      this.clearAlert();
    }, autoHideMs);
  }

  public clearAlert(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
    this.alertKind.set(null);
    this.alertMessageText.set('');
    this.alertTitleText.set('');
  }
}
