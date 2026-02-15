import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ButtonVariant, ButtonSize, ButtonWhiteSpace } from './button.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public readonly variant = input<ButtonVariant>('default');
  public readonly size = input<ButtonSize>('default');
  public readonly isLoading = input<boolean>(false);
  public readonly isDisabled = input<boolean>(false);
  public readonly fullWidth = input<boolean>(false);
  public readonly icon = input<string | null>('');
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly customColor = input<string>('');
  public readonly iconWidth = input<string>('');
  public readonly iconHeight = input<string>('');
  public readonly customWidth = input<string>('');
  public readonly customHeight = input<string>('');
  public readonly whiteSpace = input<ButtonWhiteSpace>('nowrap');
}
