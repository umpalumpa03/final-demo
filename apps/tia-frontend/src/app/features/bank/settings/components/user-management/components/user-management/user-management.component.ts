import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { UserManagementState } from '../../shared/state/user-management.state';
import { UserManagementStore } from '../../store/user-management.store';
import { UserCard } from '../../shared/ui/user-card/user-card';

@Component({
  selector: 'app-user-management',
  imports: [TextInput, UserCard],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [UserManagementState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  public readonly userState = inject(UserManagementState);

  public onSearch(query: InputFieldValue) {}

  protected readonly store = inject(UserManagementStore);

  ngOnInit() {
    this.store.loadUsers();
  }
}
