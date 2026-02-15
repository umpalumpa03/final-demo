import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  OnInit,
  OnDestroy,
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
import { debounceTime, distinctUntilChanged, filter, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserSearchService } from '../../shared/services/user-search.service';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    ErrorStates,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [UserManagementState, UserModalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent implements OnInit {
  protected readonly userState = inject(UserManagementState);
  protected readonly store = inject(UserManagementStore);
  protected readonly modalService = inject(UserModalService);

  protected readonly searchQuery = signal<string>('');
  private readonly searchSubject = new Subject<string>();

  protected readonly filteredUsers =
    UserSearchService.createFilteredUsersComputed(
      this.store.users,
      this.searchQuery,
    );

  public readonly searchControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9 ]*$/),
      Validators.maxLength(100),
    ],
  });

  protected readonly isSaving = signal(false);

  protected readonly pagination = usePagination(this.filteredUsers);
  constructor() {
    effect(() => {
      const mode = this.modalService.modalState();
      const idToDelete = this.modalService.userToDeleteId();
      const users = this.store.users();
      const loading = this.store.actionLoading();
      const error = this.store.error();
      const saving = this.isSaving();

      if (mode === 'delete' && idToDelete && !loading) {
        const userExists = users.some((u) => u.id === idToDelete);
        if (!userExists) this.onCloseModal();
      }

      if (saving && !loading && !error) {
        this.onCloseModal();
        this.isSaving.set(false);
      }

      if (saving && !loading && error) {
        this.isSaving.set(false);
      }
    });

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(),
        filter(
          () => this.searchControl.valid || this.searchControl.value === '',
        ),
        tap((query) => {
          this.searchQuery.set(query);
          this.pagination.setPage(1);
        }),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.store.loadUsers({});
  }

  public loadData(): void {
    this.store.loadUsers({ force: true });
  }

  public onSearch(query: InputFieldValue): void {
    const safeQuery = query ? String(query) : '';
    this.searchSubject.next(safeQuery);
  }

  public onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  public onEdit(id: string): void {
    this.store.clearSelectedUser();
    this.modalService.openEdit();
    this.store.loadUserDetails(id);
  }

  public onUpdateUser(data: IUpdateUserRequest): void {
    const selectedUser = this.store.selectedUser();
    if (selectedUser) {
      this.isSaving.set(true);
      this.store.updateUser({
        id: selectedUser.id,
        data: data,
      });
    }
  }

  public details(id: string): void {
    this.store.clearSelectedUser();
    this.modalService.openDetails();
    this.store.loadUserDetails(id);
  }

  public deleteUser(id: string): void {
    this.modalService.openDelete(id);
  }

  public onConfirmDelete(): void {
    const id = this.modalService.userToDeleteId();
    if (id) {
      this.store.deleteUser(id);
    }
  }

  public block(id: string, isBlocked: boolean): void {
    this.store.toggleBlockStatus({ id, isBlocked: !isBlocked });
  }

  public onCloseModal(): void {
    this.modalService.close();
    this.store.clearSelectedUser();
  }
}
