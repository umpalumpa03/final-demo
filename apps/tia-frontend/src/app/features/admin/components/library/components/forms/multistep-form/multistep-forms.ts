import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperHeader } from './stepper-header/stepper-header';
import { IStepConfig } from '../models/contact-forms.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { ContactForms } from '../contact-form/contact-form';
import { MULTI_FORM, STEP_FORM } from '../models/configs';

@Component({
  selector: 'app-multistep-forms',
  imports: [
    ReactiveFormsModule,
    StepperHeader,
    ButtonComponent,
    TextInput,
    Textarea,
  ],
  templateUrl: './multistep-forms.html',
  styleUrl: './multistep-forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultistepForms {
  public stepsConfig = STEP_FORM;
  public multiConfig = MULTI_FORM;

  private fb = inject(FormBuilder);
  public currentStep = signal<number>(1);
  public totalSteps = this.stepsConfig.length;

  public currentStepConfig = computed(
    () => this.stepsConfig[this.currentStep() - 1],
  );

  public form = this.fb.nonNullable.group({
    from: this.fb.nonNullable.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
    }),
    to: this.fb.nonNullable.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
    }),
    amount: this.fb.nonNullable.group({
      name: ['', Validators.required],
      bio: ['', Validators.required],
    }),
  });

  public next() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((v) => v + 1);
    }
  }

  public previous() {
    if (this.currentStep() > 1) {
      this.currentStep.update((v) => v - 1);
    }
  }

  public submit() {
    console.log(this.form.value);
  }
}
