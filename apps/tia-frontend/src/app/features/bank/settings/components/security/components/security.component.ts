import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';

@Component({
  selector: 'app-security',
  imports: [
    BasicCard,
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    TranslatePipe,
    Tooltip,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityComponent {
  public readonly isLoading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly success = input<boolean>(false);
  public readonly confirmPasswordConfig = input.required<InputConfig>();
  public readonly currentPasswordConfig = input.required<InputConfig>();
  public readonly newPasswordConfig = input.required<InputConfig>();
  public readonly form = input.required<FormGroup>();
  public readonly updateDisabledReason = input<string | null>(null);

  public readonly changePassword = output<{
    currentPassword: string;
    newPassword: string;
  }>();

  public constructor() {
    effect(() => {
      if (this.success()) {
        this.form().reset();
      }
    });
  }

  public isFormInvalid(): boolean {
    return this.form().invalid;
  }

  public onSubmit(): void {
    const form = this.form();

    if (form.valid) {
      const { currentPassword, newPassword } = form.value;
      this.changePassword.emit({ currentPassword, newPassword });
    }
  }
}
