import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NotificationsStore } from '../store/notifications.store';
import { HeaderNotifications } from '../components/header-notifications';
import { buffer, debounceTime, filter, map, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notifications-container',
  imports: [HeaderNotifications],
  templateUrl: './notifications-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainer {
  readonly store = inject(NotificationsStore);

  // From Parent Container Logic to open modal and get notifications element
  public isModalOpen = input<boolean>(false);
  public notificationEl = input<ElementRef | null>();

  // Track window resize
  private readonly windowSize = signal({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowSize.set({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  // Store Details
  public notificationItems = this.store.items;
  public isLoading = this.store.isLoading;
  public hasError = this.store.hasError;
  // public unreadLeft = this.store.unreadNotificationsNumber;
  public unreadLeft = this.store.unreadCount;
  public isFetching = this.store.isFetching;
  public isEmpty = this.store.isEmpty;

  // Get Modals Position
  public position = computed(() => {
    const anchorEl = this.notificationEl();
    const isOpen = this.isModalOpen();

    this.windowSize();

    if (!anchorEl || !isOpen) {
      return { top: 0, left: 0 };
    }

    const rect = anchorEl.nativeElement.getBoundingClientRect();
    return {
      top: rect.bottom,
      left: rect.right - 380,
    };
  });

  // Items Selection (Properties)
  public selectedItems = this.store.selectedItems;
  public isAllSelected = this.store.isAllSelected;
  public isIndeterminate = this.store.isIndeterminate;

  // Items Selection (Methods)
  public toggleSelectAll(): void {
    this.store.toggleSelectAll();
  }

  public individualItemSelection(id: string): void {
    this.store.toggleItemSelection(id);
  }

  // Handle CTA's
  public handleDeleteNotification(id: string): void {
    this.store.deleteNotification(id);
  }

  public handleMarkAllAsRead(): void {
    this.store.markAllAsRead();
  }

  public handleDeleteAllNotification(): void {
    this.store.deleteAll();
  }

  public handleMultipleDeletion(ids: string[]): void {
    this.store.deleteMultiple(ids);
  }

  // Handle Scroll
  public handleScrollToBottom(): void {
    if (this.store.pageInfo().hasNext) {
      this.store.fetchNotifications({
        cursor: this.store.pageInfo().nextCursor,
        limit: this.store.limitPerPage(),
      });
    }
  }

  // Handle Visible Items
  private readonly visibleItem$ = new Subject<string>();

  public handleItemVisible(id: string): void {
    this.visibleItem$.next(id);
  }

  // Here I create stream once and push items into it
  constructor() {
    this.visibleItem$
      .pipe(
        buffer(this.visibleItem$.pipe(debounceTime(2000))),
        map((ids) => [...new Set(ids)]),
        filter((ids) => ids.length > 0),
        takeUntilDestroyed(),
        tap((ids) => this.store.markItemsRead(ids)),
      )
      .subscribe();
  }

  // Handle Close button click on mobiles
  public closeModal = output<void>();

  // Add handler method
  public handleClose(): void {
    this.closeModal.emit();
  }
}
