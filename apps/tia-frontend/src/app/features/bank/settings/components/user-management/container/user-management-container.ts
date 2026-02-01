import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserManagementComponent } from '../components/user-management/user-management.component';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { UserManagementState } from '../shared/state/user-management.state';
import { UserCard } from '../shared/ui/user-card/user-card';

@Component({
  selector: 'app-user-management-container',
  imports: [BasicCard, UserManagementComponent, UserCard],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  providers: [UserManagementState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {
  public readonly userState = inject(UserManagementState);
}
