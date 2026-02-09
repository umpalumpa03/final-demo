import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { ITwoColumnLayout } from '../../models/contact-forms.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { FormsDemoState } from '../../state/forms-demo.state';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-column-layout',
  imports: [TextInput, ButtonComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './column-layout.html',
  styleUrl: './column-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnLayout {
  private fb = inject(FormBuilder);
  public readonly twoColumnLayoutForm = output<ITwoColumnLayout>();
  public readonly rowConfigs = inject(FormsDemoState).rowForm;

  public twoColumnLayoutControl = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  public submitTwoColumnLayout(): void {
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
}
