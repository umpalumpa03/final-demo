import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-user-card',
  imports: [BasicCard, ButtonComponent],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  public isBlocked = signal(false);

  public block() {
    this.isBlocked.update((v) => !v);
  }
}
