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
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-form',
  imports: [
    Radios,
    Switches,
    ReactiveFormsModule,
    ButtonComponent,
    TranslatePipe,
  ],
  templateUrl: './settings-form.html',
  styleUrl: './settings-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsForm {
  public readonly planOptions = inject(FormsDemoState).planOptions;

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  public readonly navigateRoute = input.required<string>();
  public readonly twoColumnLayoutForm = output<ISettingsForm>();

  public settingControl = this.fb.nonNullable.group({
    plan: [this.planOptions()[0]?.value ?? null, Validators.required],
    email: [true],
    push: [false],
    sms: [false],
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

  public cancel(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  public saveChange(): void {
    if (!this.settingControl.valid) {
      this.settingControl.markAllAsTouched();
      return;
    }

    this.twoColumnLayoutForm.emit(this.settingControl.getRawValue());
  }
}
