import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserHeader } from '../shared/ui/user-header/user-header';

@Component({
  selector: 'app-user-management-container',
  imports: [UserHeader],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {}
