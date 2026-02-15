import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

@Component({
  selector: 'app-mail-header',
  imports: [TranslatePipe, Checkboxes, ButtonComponent, UiModal, LibraryTitle, TranslatePipe],
  templateUrl: './mail-header.html',
  styleUrl: './mail-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailHeader {
  public readonly page = input<string>();
  public readonly messageCount = input<number>();
  public readonly isAllSelected = input<boolean>();
  public readonly toggleSelectAll = output<boolean>();
  public readonly isSent = input<boolean>(false);
  public readonly isDraft = input<boolean>(false);
  public readonly isDeleteModalOpen = signal(false);
  public readonly isDeleting = input<boolean>(false);
  private readonly isDeletePending = signal(false);
  private readonly deletingEffect = effect(() => {
    if (this.isDeletePending() && !this.isDeleting()) {
      this.isDeletePending.set(false);
      this.isDeleteModalOpen.set(false);
    }
  });

  public readonly showBulkActions = input<boolean>(false);
  public readonly bulkDelete = output<void>();
  public readonly bulkRead = output<void>();

  public onDeleteClick(): void {
    this.isDeleteModalOpen.set(true);
  }

  public onCancelDelete(): void {
    if (this.isDeleting()) {
      return;
    }
    this.isDeleteModalOpen.set(false);
  }

  public onConfirmDelete(): void {
    this.isDeletePending.set(true);
    this.bulkDelete.emit();
  }

}
