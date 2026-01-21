import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button', 
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
}