import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpData, signUpResponse } from '../model/sign-up.model';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiBase = 'https://tia.up.railway.app';

  constructor(private http: HttpClient) {}

  public signUpUser(userData: SignUpData): Observable<signUpResponse> {
    return this.http.post<any>(`${this.apiBase}/auth/signup`, userData);
  }
}
