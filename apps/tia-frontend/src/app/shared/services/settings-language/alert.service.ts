import { Injectable, signal, computed } from '@angular/core';
import { AlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertKind = signal<AlertType | null>(null);
  private alertMessageText = signal<string>('');
  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public readonly alertType = computed<AlertType | null>(() => this.alertKind());
  public readonly alertMessage = computed<string>(() => this.alertMessageText());

  public showAlert(kind: AlertType, message: string, autoHideMs = 3500): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }

    this.alertKind.set(kind);
    this.alertMessageText.set(message);

    this.alertTimeoutId = setTimeout(() => {
      this.alertKind.set(null);
      this.alertMessageText.set('');
      this.alertTimeoutId = null;
    }, autoHideMs);
  }

  public clearAlert(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
    this.alertKind.set(null);
    this.alertMessageText.set('');
  }
}
