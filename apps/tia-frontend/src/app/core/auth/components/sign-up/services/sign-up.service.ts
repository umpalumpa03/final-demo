import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { signUpResponse } from '../model/sign-up.model';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiBase = 'https://tia.up.railway.app';

  private http = inject(HttpClient);

  public signUpUser(userData: IRegistrationForm): Observable<signUpResponse> {
    return this.http.post<any>(`${this.apiBase}/auth/signup`, userData);
  }

}

