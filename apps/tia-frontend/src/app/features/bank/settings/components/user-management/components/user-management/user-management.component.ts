import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { IModalState } from '../../shared/models/users.model';

@Component({
  selector: 'app-user-management',
  imports: [TextInput, UserCard, Pagination, UserDetailsModal],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [UserManagementState, UserManagementStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  public readonly userState = inject(UserManagementState);
  protected readonly store = inject(UserManagementStore);

  protected readonly modalState = signal<IModalState>('none');

  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(4);

  protected readonly totalPages = computed(() => {
    const total = this.store.users().length;
    const size = this.pageSize();
    return total === 0 ? 1 : Math.ceil(total / size);
  });

  protected readonly visibleUsers = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const users = this.store.users();

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    return users.slice(startIndex, endIndex);
  });

  public ngOnInit(): void {
    this.store.loadUsers();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public details(id: string): void {
    this.store.clearSelectedUser();
    this.modalState.set('details');
    this.store.loadUserDetails(id);
  }

  public onCloseModal(): void {
    this.modalState.set('none');
    this.store.clearSelectedUser();
  }

  public onSearch(query: InputFieldValue): void {}
}
