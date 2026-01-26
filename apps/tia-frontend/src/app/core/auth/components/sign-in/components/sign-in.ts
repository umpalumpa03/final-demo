import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-sign-in',
  imports: [TextInput, ButtonComponent],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignIn {}
