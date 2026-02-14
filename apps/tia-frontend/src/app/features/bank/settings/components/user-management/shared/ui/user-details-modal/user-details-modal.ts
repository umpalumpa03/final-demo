import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { DetailRow, IUserDetail } from '../../models/users.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDetailsConfigService } from '../../config/user-details.config';

@Component({
  selector: 'app-user-details-modal',
  imports: [
    UiModal,
    CommonModule,
    ButtonComponent,
    RouteLoader,
    Avatar,
    TranslatePipe,
  ],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
  providers: [UserDetailsConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {
  public readonly isOpen = input<boolean>(false);
  public readonly isLoading = input<boolean>(false);

  public userData = input.required<IUserDetail | null>();
  public close = output<void>();

  private configService = inject(UserDetailsConfigService);

  public readonly userDetails = computed<DetailRow[]>(() =>
    this.configService.getConfig(this.userData()),
  );

  public getInitials(firstName: string, lastName: string): string {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + '.' + last;
  }

  public asDate(
    value: string | number | boolean | null | undefined,
  ): string | number | Date {
    return value as string | number | Date;
  }
}
