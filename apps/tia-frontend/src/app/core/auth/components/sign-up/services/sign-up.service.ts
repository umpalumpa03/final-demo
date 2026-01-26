import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpData } from '../model/sign-up.model';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiBase = 'https://tia.up.railway.app';

  constructor(private http: HttpClient) {}

  /* 
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "username": "newuser",
      "password": "securePassword123"
    }
  */

  public signUpUser(userData: SignUpData): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/signup`, userData);
  }
}
