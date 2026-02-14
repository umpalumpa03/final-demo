import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { UserManagementState } from '../shared/state/user-management.state';
import { UserManagementStore } from '../store/user-management.store';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-management-container',
  imports: [BasicCard, RouterOutlet],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {
  public readonly userState = inject(UserManagementState);
}
