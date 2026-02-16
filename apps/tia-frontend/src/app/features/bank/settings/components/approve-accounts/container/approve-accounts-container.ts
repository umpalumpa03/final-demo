import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';
import { AccountPermissionsStore } from '../store/approve-accounts.store';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { IAccountsPermissions } from '../../../shared/models/approve-models/accounts-models/account-permissions.models';
import { buttonEmit } from '../../../shared/models/approve-models/cards-models/approve-card-element.model';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { CardsApproveElement } from '../../../shared/ui/approve-ui/approve-card-element/cards-approve-element';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { calculateBitwiseSum } from '../utils/permission.utils';
import { formatUserFullName } from '../utils/user-formatter.utils';
import { PermissionsModal } from '../../../shared/ui/approve-ui/permissions-modal/permissions-modal';
import { ApproveAccountsConfig } from '../config/approve-accounts.config';

@Component({
  selector: 'app-approve-accounts-container',
  standalone: true,
  imports: [
    PermissionsModal,
    UiModal,
    ScrollArea,
    Skeleton,
    CardsApproveElement,
    ErrorStates,
    ButtonComponent,
    AlertTypesWithIcons,
    BasicCard,
  ],
  providers: [ApproveAccountsConfig],
  templateUrl: './approve-accounts-container.html',
  styleUrl: './approve-accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveAccountsContainer implements OnInit {
  public readonly store = inject(AccountPermissionsStore);
  public readonly config = inject(ApproveAccountsConfig);
  public readonly fb = inject(FormBuilder);

  public permissionsOverlay = signal<boolean>(false);
  public confirmModalActive = signal<boolean>(false);
  private confirmDialogAnswer = signal<boolean>(false);

  public activeAccountId = signal<string | null>(null);
  public permissionsSavedAccount = signal<string | null>(null);
  private pendingId = signal<string | null>(null);

  public readonly permissionsForm: FormRecord<FormControl<boolean>> =
    this.fb.record<FormControl>({});

  public readonly activeAccount = computed(() =>
    this.store
      .pendingAccounts()
      .find((acc) => acc.id === this.activeAccountId()),
  );

  public readonly accountName = computed(
    () => this.activeAccount()?.name ?? 'Unknown Account',
  );

  public readonly fullName = computed(() =>
    formatUserFullName(this.activeAccount()?.user),
  );

  public readonly mappedPermissions = computed<IAccountsPermissions[]>(() =>
    this.store.permissions().map((p) => ({
      value: p.value,
      label: p.label,
    })),
  );

  constructor() {
    effect(() => {
      this.syncFormControls(this.store.permissions());
    });
  }

  public ngOnInit(): void {
    this.store.loadPermissions();
    this.store.loadPendingAccounts();
  }

  public handleAction(event: buttonEmit): void {
    const { action, id } = event;
    switch (action) {
      case 'permissions':
        this.openPermissionsModal(id);
        break;
      case 'approve':
        this.handleApprove(id);
        break;
      case 'decline':
        this.handleDecline(id);
        break;
    }
  }

  public onSavePermissions(): void {
    const accId = this.activeAccountId();
    if (!accId) return;

    this.permissionsSavedAccount.set(accId);
    this.closeModal();
  }

  private openPermissionsModal(id: string): void {
    if (
      this.permissionsSavedAccount() &&
      this.permissionsSavedAccount() !== id
    ) {
      this.confirmModalActive.set(true);
      this.pendingId.set(id);
      return;
    }

    this.activeAccountId.set(id);
    this.permissionsOverlay.set(true);
  }

  private handleApprove(id: string): void {
    if (this.permissionsSavedAccount() === id) {
      const permissionsSum = calculateBitwiseSum(
        this.permissionsForm.getRawValue(),
      );

      this.store.savePermissions({
        accountId: id,
        permissions: permissionsSum,
      });

      this.clearPermissionsState();
    }

    this.store.updateStatus({
      accountId: id,
      updatedStatus: 'active',
    });
  }

  private handleDecline(id: string): void {
    this.store.updateStatus({
      accountId: id,
      updatedStatus: 'closed',
    });
  }

  private syncFormControls(permissions: IAccountsPermissions[]): void {
    Object.keys(this.permissionsForm.controls).forEach((key) => {
      this.permissionsForm.removeControl(key);
    });

    permissions.forEach((p) => {
      this.permissionsForm.addControl(
        p.value.toString(),
        new FormControl(false, { nonNullable: true }),
      );
    });
  }

  public closeModal(): void {
    if (this.activeAccountId() !== this.permissionsSavedAccount()) {
      this.permissionsForm.reset();
    }
    this.permissionsOverlay.set(false);
  }

  public closeConfirmModal(): void {
    this.confirmModalActive.set(false);
  }

  public cancelPermissionChanges(): void {
    if (this.permissionsSavedAccount() === this.activeAccountId()) {
      this.permissionsSavedAccount.set(null);
    }
    this.permissionsForm.reset();
    this.permissionsOverlay.set(false);
  }

  public onConfirmCancel(): void {
    this.confirmDialogAnswer.set(false);
    this.closeConfirmModal();
    this.pendingId.set(null);
  }

  public onConfirmAccept(): void {
    this.clearPermissionsState();
    this.confirmDialogAnswer.set(true);
    this.closeConfirmModal();

    if (this.pendingId()) {
      this.openPermissionsModal(this.pendingId()!);
    }
  }

  public retryLoading(): void {
    this.store.loadPendingAccounts();
  }

  private clearPermissionsState(): void {
    this.permissionsSavedAccount.set(null);
    this.permissionsForm.reset();
  }
}
