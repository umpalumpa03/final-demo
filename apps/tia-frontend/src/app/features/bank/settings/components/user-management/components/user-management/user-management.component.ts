import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-management.component',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {}
