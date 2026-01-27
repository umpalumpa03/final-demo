import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  public signOut(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${environment.apiUrl}/auth/logout`,
      {},
    );
  }
}
