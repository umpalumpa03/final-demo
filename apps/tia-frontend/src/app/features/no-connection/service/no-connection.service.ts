import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NoConnectionService {
  public onOnline: () => void = () => {};
  public onOffline: () => void = () => {};

  constructor() {
    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }
}
