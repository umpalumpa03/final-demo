import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { IUser } from '../../models/users.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [BasicCard, ButtonComponent, CommonModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  public readonly user = input.required<IUser>();

  public readonly isLoading = input<boolean>(false);

  public readonly onBlockToggle = output<string>();
  public readonly onDetails = output<string>();
  public readonly onEdit = output<string>();
  public readonly onDelete = output<string>();

  public toggleBlock(): void {
    this.onBlockToggle.emit(this.user().id);
  }
}
