import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Radios } from '@tia/shared/lib/forms/radios/radios';
import { Switches } from '@tia/shared/lib/forms/switches/switches';
import { ISettingsForm } from '../models/contact-forms.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-form',
  imports: [Radios, Switches, ReactiveFormsModule, ButtonComponent],
  templateUrl: './settings-form.html',
  styleUrl: './settings-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsForm {
  //will be deleted
  public planOptions = [
    {
      label: 'Free',
      value: 'free',
      description: 'Basic features',
      initialValue: true,
    },
    {
      label: 'Pro',
      value: 'pro',
      description: 'Advanced features - $9.99/month',
    },
    {
      label: 'Enterprise',
      value: 'enterprise',
      description: 'All features - $29.99/month',
    },
  ];

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  public readonly navigateRoute = input.required<string>();
  public readonly twoColumnLayoutForm = output<ISettingsForm>();

  public settingControl = this.fb.nonNullable.group({
    plan: [this.planOptions[0]?.value ?? null, Validators.required],
    email: [true, Validators.required],
    push: [false, Validators.required],
    sms: [false, Validators.required],
  });

  public get email() {
    return this.settingControl.get('email')?.value ?? false;
  }

  public get push() {
    return this.settingControl.get('push')?.value ?? false;
  }

  public get sms() {
    return this.settingControl.get('sms')?.value ?? false;
  }

  public get plan() {
    return { initialValue: this.settingControl.value.plan, hasBorder: true };
  }

  public cancel(route: string) {
    this.router.navigate([`/${route}`]);
  }

  public saveChange() {
    if (!this.settingControl.valid) {
      this.settingControl.markAllAsTouched();
      return;
    }

    this.twoColumnLayoutForm.emit(this.settingControl.getRawValue());
  }
}
