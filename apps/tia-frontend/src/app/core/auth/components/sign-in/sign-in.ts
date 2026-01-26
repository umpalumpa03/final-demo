import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  public isLoading = this.authService.isLoginLoading();

  public loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', Validators.required],
  });

  public submit(): void {
    this.authService.loginPostRequest(this.loginForm.getRawValue()).subscribe();
  }
}
