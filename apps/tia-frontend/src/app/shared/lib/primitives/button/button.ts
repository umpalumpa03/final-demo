import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.model';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
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

  public readonly isHexColor = computed(() => {
    return (
      this.customColor().startsWith('#') || this.customColor().startsWith('rgb')
    );
  });
}
