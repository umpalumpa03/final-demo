import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'small' | 'default' | 'large' | 'icon';

@Component({
  selector: 'button[app-button], a[app-button]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'isDisabled() || isLoading() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() || isLoading()',
    '[class.tia-btn--disabled]': 'isDisabled() || isLoading()',
  }
})
export class ButtonComponent {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);
  fullWidth = input<boolean>(false);

  protected hostClasses = computed(() => {
    return [
      'tia-btn',
      `tia-btn--${this.variant()}`,
      `tia-btn--${this.size()}`,
      this.fullWidth() ? 'tia-btn--full-width' : '',
      this.isLoading() ? 'tia-btn--loading' : ''
    ].filter(Boolean).join(' ');
  });
}