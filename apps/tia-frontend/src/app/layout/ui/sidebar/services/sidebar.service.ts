import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
// import { TokenService } from 'apps/tia-frontend/src/app/core/auth/services/token.service';
@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly http = inject(HttpClient);
  // private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  public signOut(): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          // this.tokenService.clearAllToken(); for later
          this.router.navigate(['/auth/login']);
        }),
      );
  }
}
