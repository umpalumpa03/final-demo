import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { INPUT_CONFIG } from '../../shared/config/user-management.config';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';

@Component({
  selector: 'app-user-management',
  imports: [TextInput],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  public readonly inputCfg = INPUT_CONFIG;

  onSearch(query: InputFieldValue) {}
}
