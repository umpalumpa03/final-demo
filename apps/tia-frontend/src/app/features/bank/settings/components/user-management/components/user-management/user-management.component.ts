import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { UserManagementState } from '../../shared/state/user-management.state';
import { UserManagementStore } from '../../store/user-management.store';
import { UserCard } from '../../shared/ui/user-card/user-card';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';
import { UserDetailsModal } from '../../shared/ui/user-details-modal/user-details-modal';
import { ConfirmModal } from '../../shared/ui/confirm-modal/confirm-modal';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { usePagination } from '../../shared/services/pagination.service';
import { UserModalService } from '../../shared/services/user-modal.service';
import { UserEditModal } from '../../shared/ui/user-edit-modal/user-edit-modal';
import { IUpdateUserRequest } from '../../shared/models/users.model';

@Component({
  selector: 'app-user-management',
  imports: [
    TextInput,
    UserCard,
    Pagination,
    UserDetailsModal,
    ConfirmModal,
    Skeleton,
    UserEditModal,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [UserManagementState, UserManagementStore, UserModalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  protected readonly userState = inject(UserManagementState);
  protected readonly store = inject(UserManagementStore);
  protected readonly modalService = inject(UserModalService);

  protected readonly actionProcessingId = signal<string | null>(null);

  protected readonly pagination = usePagination(this.store.users, 4);

  constructor() {
    this.setupAutoCloseModal();
  }

  ngOnInit(): void {
    this.store.loadUsers();
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  onEdit(id: string): void {
    this.store.clearSelectedUser();
    this.modalService.openEdit();
    this.store.loadUserDetails(id);
  }

  onUpdateUser(data: IUpdateUserRequest): void {
    const selectedUser = this.store.selectedUser();

    if (selectedUser) {
      this.store.updateUser({
        id: selectedUser.id,
        data: data,
      });
      this.onCloseModal();
      this.store.loadUsers();
    }
  }

  details(id: string): void {
    this.store.clearSelectedUser();
    this.modalService.openDetails();
    this.store.loadUserDetails(id);
  }

  deleteUser(id: string): void {
    this.modalService.openDelete(id);
  }

  onConfirmDelete(): void {
    const id = this.modalService.userToDeleteId();
    if (id) {
      this.store.deleteUser(id);
    }
  }

  block(id: string, isBlocked: boolean): void {
    this.actionProcessingId.set(id);
    this.store.toggleBlockStatus({ id, isBlocked: !isBlocked });
  }

  onCloseModal(): void {
    this.modalService.close();
    this.store.clearSelectedUser();
  }

  onSearch(query: InputFieldValue): void {}

  private setupAutoCloseModal(): void {
    effect(() => {
      const mode = this.modalService.modalState();
      const idToDelete = this.modalService.userToDeleteId();
      const users = this.store.users();
      const loading = this.store.actionLoading();

      if (mode === 'delete' && idToDelete && !loading) {
        const userExists = users.some((u) => u.id === idToDelete);
        if (!userExists) {
          this.onCloseModal();
        }
      }
    });
  }
}
