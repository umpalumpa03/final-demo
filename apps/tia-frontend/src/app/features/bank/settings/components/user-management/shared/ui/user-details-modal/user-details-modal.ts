import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { IUserDetail } from '../../models/users.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-user-details-modal',
  imports: [UiModal, CommonModule, ButtonComponent],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {
  public readonly isOpen = input<boolean>(false);
  public userData = input.required<IUserDetail>();
  public close = output<void>();
}
