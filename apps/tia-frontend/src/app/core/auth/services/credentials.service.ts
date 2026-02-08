import { Injectable } from '@angular/core';

export type Credentials = { username?: string; save?: boolean };

@Injectable({ providedIn: 'root' })
export class CredentialsService {
  private key = 'credentials';

  public getCredentials(): Credentials {
    const credentials = localStorage.getItem(this.key);
    if (!credentials) {
      return {};
    }

    return JSON.parse(credentials) as Credentials;
  }

  public initialUsername(): string {
    return this.getCredentials().username ?? '';
  }

  public initialCheckboxValue(): boolean {
    return Boolean(this.getCredentials().save);
  }

  public saveCredentials(credentials: Credentials | null): void {
    if (!credentials) {
      localStorage.removeItem(this.key);
      return;
    }

    localStorage.setItem(this.key, JSON.stringify(credentials));
  }

  public clear(): void {
    localStorage.removeItem(this.key);
  }
}
