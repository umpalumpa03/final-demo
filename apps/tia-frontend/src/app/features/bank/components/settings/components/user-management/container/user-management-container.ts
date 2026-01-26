import { Component } from '@angular/core';
import { UserManagementComponent } from '../components/user-management.component';

@Component({
  selector: 'app-user-management-container',
  imports: [UserManagementComponent],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
})
export class UserManagementContainer {
}
