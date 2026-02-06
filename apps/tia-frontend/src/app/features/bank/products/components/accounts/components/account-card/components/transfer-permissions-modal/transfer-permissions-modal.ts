import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UiModal } from '../../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '../../../../../../../../../shared/lib/primitives/button/button';
import { TransferPermission } from './model/transfer-permission.model';
import {
  TRANSFER_PERMISSIONS,
  VALID_PERMISSION_VALUES,
} from '../../../../config/transfer-permissions.config';

@Component({
  selector: 'app-transfer-permissions-modal',
  imports: [CommonModule, TranslatePipe, UiModal, ButtonComponent],
  templateUrl: './transfer-permissions-modal.html',
  styleUrl: './transfer-permissions-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferPermissionsModalComponent {
  public isOpen = input.required<boolean>();
  public accountPermission = input.required<number>();
  public permissionSelected = output<number>();
  public closed = output<void>();

  public readonly permissions = computed<TransferPermission[]>(
    () => TRANSFER_PERMISSIONS,
  );

  public readonly availablePermissions = computed(() => {
    const permission = this.accountPermission();
    if (
      !VALID_PERMISSION_VALUES.includes(
        permission as (typeof VALID_PERMISSION_VALUES)[number],
      )
    ) {
      return [];
    }
    return this.permissions().filter(
      (p) =>
        VALID_PERMISSION_VALUES.includes(
          p.value as (typeof VALID_PERMISSION_VALUES)[number],
        ) && (permission & p.value) === p.value,
    );
  });

  public onPermissionSelect(permissionValue: number): void {
    this.permissionSelected.emit(permissionValue);
  }

  public onClose(): void {
    this.closed.emit();
  }
}
