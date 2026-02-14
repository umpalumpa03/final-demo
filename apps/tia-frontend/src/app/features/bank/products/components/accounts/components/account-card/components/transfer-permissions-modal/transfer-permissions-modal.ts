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
import { TransferPermission } from '../../../../model/transfer-permission.model';
import { TRANSFER_PERMISSIONS } from '../../../../config/transfer-permissions.config';
import { filterPermissionsByCurrency } from '../../../../utils/transfer-permissions.utils';

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
  public accountCurrency = input<string>('');
  public permissionSelected = output<number>();
  public closed = output<void>();

  public readonly permissions = computed<TransferPermission[]>(
    () => TRANSFER_PERMISSIONS,
  );

  public readonly availablePermissions = computed(() => {
    const permission = this.accountPermission();
    const currency = this.accountCurrency();
    return filterPermissionsByCurrency(
      this.permissions(),
      permission,
      currency,
    );
  });

  public onPermissionSelect(permissionValue: number): void {
    this.permissionSelected.emit(permissionValue);
  }

  public onClose(): void {
    this.closed.emit();
  }
}
