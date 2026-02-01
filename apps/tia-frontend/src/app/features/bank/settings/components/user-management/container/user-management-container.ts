import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementComponent } from '../components/user-management/user-management.component';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { HEADER_CONFIG } from '../shared/config/user-header.config';

@Component({
  selector: 'app-user-management-container',
  imports: [BasicCard, UserManagementComponent],
  templateUrl: './user-management-container.html',
  styleUrl: './user-management-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementContainer {
  public readonly cfg = HEADER_CONFIG;
}
