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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { UserEditConfigService } from '../../config/user-edit.config';

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
    TranslatePipe,
  ],
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.scss',
  providers: [UserEditConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditModal {
  private readonly fb = inject(FormBuilder);
  protected readonly editConfig = inject(UserEditConfigService).getFormConfig();

  public readonly isOpen = input<boolean>(false);
  public readonly isLoading = input<boolean>(false);
  public userData = input.required<IUserDetail | null>();

  public close = output<void>();
  public save = output<IUpdateUserRequest>();

  public readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    pId: ['', [Validators.minLength(11), Validators.maxLength(11)]],
    role: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.userData();
      if (user) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          pId: user.pId,
          role: user.role,
        });
      } else {
        this.form.reset();
      }
    });
  }

  public onSave(): void {
    if (this.form.valid) {
      const { pId, ...otherFields } = this.form.getRawValue();
      const payload = {
        ...otherFields,
        ...(pId ? { pId } : {}),
      } as IUpdateUserRequest;

      this.save.emit(payload);
    }
  }
}
