import { Component, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { SignUpService } from '../services/sign-up.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignUpData } from '../model/sign-up.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private signUpService = inject(SignUpService);
  private destroyRef = inject(DestroyRef)

  public apiResult = signal<string>('Idle');

  public onTest():void{
    this.apiResult.set('Checking...');

    const payload: SignUpData = {
    firstName: "John",
    lastName: "Doe",
    email: "randomEmail@example.com",
    username: "newuser",
    password: "securePassword123"
  };

    this.signUpService.signUpUser(payload).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((res) => {
        this.apiResult.set("Complete") 
        console.log(res, "__APIRESPONSE")
      })
    ).subscribe()
  }
}
