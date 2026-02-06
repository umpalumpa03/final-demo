import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { IUpdateUserRequest, IUserDetail } from '../../models/users.model';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { CommonModule } from '@angular/common';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { USER_ROLE } from '../../config/user-edit.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit-modal',
  imports: [
    UiModal,
    ButtonComponent,
    RouteLoader,
    CommonModule,
    TextInput,
    Dropdowns,
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditModal {
  private readonly fb = inject(FormBuilder);

  public readonly select = USER_ROLE;
  public readonly isOpen = input<boolean>(false);
  public readonly isLoading = input<boolean>(false);
  public userData = input.required<IUserDetail | null>();

  public close = output<void>();
  public save = output<IUpdateUserRequest>();

  public readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: ['', Validators.required],
  });

  protected readonly firstNameConfig = {
    label: 'First Name',
    placeholder: 'Enter first name',
  };
  protected readonly lastNameConfig = {
    label: 'Last Name',
    placeholder: 'Enter last name',
  };

  constructor() {
    effect(() => {
      const user = this.userData();
      if (user) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      } else {
        this.form.reset();
      }
    });
  }

  public onSave(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as IUpdateUserRequest);
    }
  }
}
