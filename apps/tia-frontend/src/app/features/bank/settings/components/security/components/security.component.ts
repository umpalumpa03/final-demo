import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-security',
  imports: [
    BasicCard,
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityComponent {
  public readonly changePasswordForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.changePasswordForm.valid) {
     console.log('Form submitted:', this.changePasswordForm.value);
    }
  }
}
