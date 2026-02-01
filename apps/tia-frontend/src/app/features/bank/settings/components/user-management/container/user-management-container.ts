import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementComponent } from '../components/user-management/user-management.component';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { UserManagamentState } from '../shared/state/user-management.state';

@Component({
  selector: 'app-user-management-container',
  imports: [BasicCard, UserManagementComponent],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {
  public readonly userState = new UserManagamentState();
}
