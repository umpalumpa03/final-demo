import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class BirthdayApiService { 
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public dismissBirthdayModal(year: number): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.apiUrl}/users/birthday-modal-dismiss`,
      { year }
    );
  }
}
