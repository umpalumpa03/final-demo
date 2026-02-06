import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserManagementComponent } from '../components/user-management/user-management.component';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { UserManagementState } from '../shared/state/user-management.state';
import { UserManagementStore } from '../store/user-management.store';

@Component({
  selector: 'app-user-management-container',
  imports: [BasicCard, UserManagementComponent],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  providers: [UserManagementState, UserManagementStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {
  public readonly userState = inject(UserManagementState);
}
