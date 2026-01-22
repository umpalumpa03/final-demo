import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Avatar } from '../avatar';
import { AvatarColor, AvatarGroupItem, AvatarSize, AvatarTone } from '../../models/avatar.model';

@Component({
  selector: 'app-avatar-group',
  imports: [Avatar],
  templateUrl: './avatar-group.html',
  styleUrl: './avatar-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroup {
  public readonly avatars = input<AvatarGroupItem[]>([]);
  public readonly size = input<AvatarSize>('md');
  public readonly max = input<number>(4);
  public readonly overflowTone = input<AvatarTone>('soft');
  public readonly overflowColor = input<AvatarColor>('gray');

  public readonly visibleAvatars = computed(() => this.avatars().slice(0, this.max()));
  public readonly overflowCount = computed(() => Math.max(this.avatars().length - this.max(), 0));
}
