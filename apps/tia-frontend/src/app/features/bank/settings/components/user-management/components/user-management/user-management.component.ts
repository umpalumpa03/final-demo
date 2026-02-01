import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { UserManagementState } from '../../shared/state/user-management.state';

@Component({
  selector: 'app-user-management',
  imports: [TextInput],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [UserManagementState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  public readonly userState = inject(UserManagementState);

  public onSearch(query: InputFieldValue) {}
}
