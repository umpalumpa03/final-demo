import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-verified-user-card',
  imports: [],
  templateUrl: './verified-user-card.html',
  styleUrl: './verified-user-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifiedUserCard {
  public readonly fullName = input.required<string>();
  public readonly description = input<string>('Verified User');

  protected readonly initials = computed(() => {
    const name = this.fullName();
    const parts = name.trim().split(' ');

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });
}
