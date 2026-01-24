import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  AvatarColor,
  AvatarSize,
  AvatarStatus,
  AvatarTone,
} from './models/avatar.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  public readonly size = input<AvatarSize>('md');
  public readonly initials = input<string>('');
  public readonly tone = input<AvatarTone>('soft');
  public readonly color = input<AvatarColor>('blue');
  public readonly status = input<AvatarStatus | null>(null);

  public readonly avatarClass = computed(
    () =>
      `avatar avatar--${this.size()} avatar--${this.tone()} avatar--${this.color()}`,
  );

  public readonly showStatus = computed(
    () => this.status() !== null && this.status() !== undefined,
  );

  public readonly statusClass = computed(() => {
    const status = this.status();
    if (!status) {
      return 'avatar__status';
    }
    return `avatar__status avatar__status--${status}`;
  });
}
