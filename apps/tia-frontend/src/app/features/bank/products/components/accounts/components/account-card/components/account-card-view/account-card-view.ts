import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect,
  computed,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Account } from '../../../../../../../../../shared/models/accounts/accounts.model';
import { ButtonComponent } from '../../../../../../../../../shared/lib/primitives/button/button';
import { BasicCard } from '../../../../../../../../../shared/lib/cards/basic-card/basic-card';
import { TextInput } from '../../../../../../../../../shared/lib/forms/input-field/text-input';
import { Badges } from '../../../../../../../../../shared/lib/primitives/badges/badges';
import { TRANSFER_PERMISSIONS } from '../../../../config/transfer-permissions.config';
import { filterPermissionsByCurrency } from '../../../../utils/transfer-permissions.utils';
@Component({
  selector: 'app-account-card-view',
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ButtonComponent,
    BasicCard,
    TextInput,
    Badges,
  ],
  templateUrl: './account-card-view.html',
  styleUrl: './account-card-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardViewComponent {
  public account = input.required<Account>();
  public accountIcon = input.required<string>();
  public formattedBalance = input.required<string>();
  public formattedDate = input.required<string>();
  public isRenaming = input.required<boolean>();
  public renameError = input<string | null>(null);

  public transfer = output<void>();
  public rename = output<string>();
  public renameSuccess = output<void>();

  protected isEditing = signal<boolean>(false);
  protected newName = signal<string>('');
  protected renamingAccountId = signal<string | null>(null);
  protected displayName = computed(
    () => this.account().friendlyName || this.account().name,
  );
  protected canMakeTransfer = computed(() => {
    const permission = this.account().permission;
    const currency = this.account().currency;

    const availablePermissions = filterPermissionsByCurrency(
      TRANSFER_PERMISSIONS,
      permission,
      currency,
    );

    return availablePermissions.length > 0;
  });

  private elementRef = inject(ElementRef);
  private dragStart = signal<number | null>(null);

  constructor() {
    effect(() => {
      const account = this.account();
      const accountId = account.id;
      const renamingId = this.renamingAccountId();
      const isRenaming = this.isRenaming();
      const hasError = !!this.renameError();

      if (
        renamingId === accountId &&
        !isRenaming &&
        !hasError &&
        this.isEditing()
      ) {
        this.isEditing.set(false);
        this.newName.set('');
        this.renamingAccountId.set(null);
        this.renameSuccess.emit();
      }
    });

    effect(() => {
      if (this.isEditing()) {
        const tryFocus = (attempts = 0) => {
          const inputElement = this.elementRef.nativeElement.querySelector(
            'lib-text-input input',
          );

          if (inputElement instanceof HTMLInputElement) {
            inputElement.focus();
          } else if (attempts < 10) {
            setTimeout(() => tryFocus(attempts + 1), 50);
          }
        };

        setTimeout(() => tryFocus(), 0);
      }
    });
  }

  public handleOpenTransferModal(): void {
    this.transfer.emit();
  }

  public handleRenameClick(): void {
    const currentName = this.account().friendlyName || this.account().name;
    this.newName.set(currentName);
    this.isEditing.set(true);
  }

  public handleSave(): void {
    const trimmedName = this.newName().trim();
    const currentName = this.account().friendlyName || this.account().name;

    if (trimmedName && trimmedName !== currentName) {
      this.renamingAccountId.set(this.account().id);
      this.rename.emit(trimmedName);
    } else {
      this.isEditing.set(false);
      this.newName.set('');
    }
  }

  public handleBlur(): void {
    const trimmedName = this.newName().trim();
    const currentName = this.account().friendlyName || this.account().name;

    if (trimmedName && trimmedName !== currentName) {
      this.renamingAccountId.set(this.account().id);
      this.rename.emit(trimmedName);
    } else {
      this.isEditing.set(false);
      this.newName.set('');
    }
  }

  public onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    this.dragStart.set(event.clientX);
  }

  public onMouseMove(event: MouseEvent): void {
    const startX = this.dragStart();
    if (startX === null) return;
    const scrollContainer = this.elementRef.nativeElement.closest(
      '.accounts-list__section-grid',
    )?.parentElement;
    if (scrollContainer) {
      const scrollLeft = scrollContainer.scrollLeft;
      scrollContainer.scrollLeft = scrollLeft - (event.clientX - startX);
      this.dragStart.set(event.clientX);
    }
  }

  public onMouseUp(): void {
    this.dragStart.set(null);
  }
}
