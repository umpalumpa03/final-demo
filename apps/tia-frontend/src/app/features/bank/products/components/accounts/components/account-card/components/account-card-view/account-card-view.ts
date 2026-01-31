import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  effect,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Account } from '../../../../../../../../../shared/models/accounts/accounts.model';
import { ButtonComponent } from '../../../../../../../../../shared/lib/primitives/button/button';
import { BasicCard } from '../../../../../../../../../shared/lib/cards/basic-card/basic-card';
import { TextInput } from '../../../../../../../../../shared/lib/forms/input-field/text-input';

@Component({
  selector: 'app-account-card-view',
  imports: [CommonModule, FormsModule, ButtonComponent, BasicCard, TextInput],
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

  protected isEditing = signal<boolean>(false);
  protected newName = signal<string>('');
  protected renamingAccountId = signal<string | null>(null);
  protected displayName = computed(
    () => this.account().friendlyName || this.account().name,
  );

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
      }
    });
  }

  public handleTransfer(): void {
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
    }
  }

  public handleCancel(): void {
    this.isEditing.set(false);
    this.newName.set('');
  }

  public isSaveDisabled(): boolean {
    const trimmedName = this.newName().trim();
    return (
      this.isRenaming() ||
      !trimmedName ||
      trimmedName === (this.account().friendlyName || this.account().name)
    );
  }
}
