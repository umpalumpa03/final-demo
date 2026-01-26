import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap } from 'rxjs';
import { SignUpService } from '../services/sign-up.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignUpData, signUpResponse } from '../model/sign-up.model';
import { RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, RegistrationForm],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private signUpService = inject(SignUpService);
  private destroyRef = inject(DestroyRef);

  // Loading State
  public apiResult = signal<string>('Idle');

  public placeHolder = signal<signUpResponse>({
    id: '',
    email: '',
    username: '',
    createdAt: '',
    signup_token: '',
  });

  // SignUpData
  public onSignUp(signUpData: any): void {
    this.apiResult.set('Checking...');
    /*
      {
          "id": "a9431998-af79-4a09-9766-af429ae1f25f",
          "email": "misho123@gmail.com",
          "username": "misho123gmail",
          "createdAt": "2026-01-26T10:37:11.797Z",
          "signup_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTQzMTk5OC1hZjc5LTRhMDktOTc2Ni1hZjQyOWFlMWYyNWYiLCJ1c2VybmFtZSI6Im1pc2hvMTIzZ21haWwiLCJzY29wZSI6InNpZ251cF9waG9uZSIsImF1ZCI6InNpZ251cCIsImp0aSI6IjliOTRmOTZkLTQ1MDgtNDIzOS1iZGIxLTcxODc3MjgzZTc4OSIsImlhdCI6MTc2OTQyMzgzMSwiZXhwIjoxNzY5NDI3NDMxfQ.grJ5vsxTy5T9lHu6IeRNHiw8wnPo39R3mMzmpyDKLmU"
      }
    */

    this.signUpService
      .signUpUser(signUpData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.apiResult.set('Complete');
          if (res)
            //error error message
            // else set
            this.apiResult.set('Complete');
          console.log(res, '__APIRESPONSE');
        }),

        catchError((err) => {
          const messages = err.error?.message;

          if (Array.isArray(messages)) {
            this.apiResult.set(messages[0]);
          } else {
            this.apiResult.set('Registration failed');
          }

          // --
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
