import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IHorizontalLayout,
  ITwoColumnLayout,
} from '../models/contact-forms.model';

@Component({
  selector: 'app-layout-form',
  imports: [TextInput, ButtonComponent, Textarea, ReactiveFormsModule],
  templateUrl: './layout-form.html',
  styleUrls: ['./layout-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutForm {
  private readonly fb = inject(FormBuilder);
  public readonly twoColumnLayoutForm = output<ITwoColumnLayout>();
  public readonly horizontalLayoutForm = output<IHorizontalLayout>();

  public twoColumnLayoutControl = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  public horizontalForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: [''],
  });

  public submitTwoColomnLayout() {
    if (
      this.twoColumnLayoutControl.invalid ||
      !this.twoColumnLayoutControl.value
    ) {
      this.twoColumnLayoutControl.markAllAsTouched();
      return;
    }

    this.twoColumnLayoutForm.emit(this.twoColumnLayoutControl.getRawValue());
    this.twoColumnLayoutControl.reset();
  }

  public submitHorizontalLayout() {
    if (this.horizontalForm.invalid || !this.horizontalForm.value) {
      this.horizontalForm.markAllAsTouched();
      return;
    }

    this.horizontalLayoutForm.emit(this.horizontalForm.getRawValue());
    this.horizontalForm.reset();
  }

  //this is temporary configs
  public readonly rowConfigs = {
    firstName: {
      label: 'First Name',
      placeholder: 'Jhon',
    },
    lastName: {
      label: 'Last Name',
      placeholder: 'Doe',
    },
    email: {
      label: 'Email',
      placeholder: 'jonh@example.com',
    },
    phone: {
      label: 'Phone',
      placeholder: '+1 (555) 000-0000',
    },
  } as const;

  public readonly horizontalConfigs = {
    firstName: {
      placeholder: 'Jhon',
    },
    message: {
      placeholder: 'Doe',
    },
    email: {
      placeholder: 'jonh@example.com',
    },
  } as const;
}
