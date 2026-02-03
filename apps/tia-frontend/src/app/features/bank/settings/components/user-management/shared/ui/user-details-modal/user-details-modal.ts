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
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-user-details-modal',
  imports: [UiModal, CommonModule, ButtonComponent, RouteLoader],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {
  public readonly isOpen = input<boolean>(false);

  public readonly isLoading = input<boolean>(false);

  public userData = input.required<IUserDetail | null>();
  public close = output<void>();
}
