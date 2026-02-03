import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { ItemsData } from '../models/notification.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { NotificationsStore } from '../store/notifications.store';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { VisibleInViewportDirective } from '../directives/visible-in-viewport.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header-notifications',
  imports: [
    ScrollArea,
    DatePipe,
    Checkboxes,
    TitleCasePipe,
    RouteLoader,
    ButtonComponent,
    ErrorStates,
    VisibleInViewportDirective,
    TranslatePipe,
  ],
  templateUrl: './header-notifications.html',
  styleUrl: './header-notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifications {
  readonly store = inject(NotificationsStore);

  // For Modal Appearance
  public readonly isOpen = input<boolean>(false);
  public readonly top = input<number>(0);
  public readonly left = input<number>(0);

  // Store Management working
  public notificationItems = input<ItemsData[]>([]);
  public isLoading = input<boolean>(false);
  public hasError = input<boolean>(false);
  public unreadLeft = input<number>(0);
  public isFetching = input<boolean>(false);
  public isEmpty = input<boolean>(false);

  // Notifications Selection Inputs
  public isAllSelected = input<boolean>(false);
  public selectedItems = input<string[]>([]);

  // Outputs For Selection
  public selectAll = output<ItemsData[]>();
  public selectItem = output<string>();
  public isIndeterminate = input.required<boolean>();

  public onSelectAllClicked(messages: ItemsData[]): void {
    this.selectAll.emit(messages);
  }

  public onSelectItemClicked(id: string): void {
    this.selectItem.emit(id);
  }

  public isItemSelected(id: string) {
    return this.selectedItems().includes(id);
  }

  // Action Properties
  public deleteNotification = output<string>();
  public markAllAsRead = output<void>();
  public deleteAllNotification = output<void>();
  public deleteMultipleNotification = output<string[]>();

  // Action Methods
  public onTrashIconClick(id: string): void {
    this.deleteNotification.emit(id);
  }

  public onMarkAllClick(): void {
    this.markAllAsRead.emit();
  }

  public onDeleteAllClicked(): void {
    this.deleteAllNotification.emit();
  }

  public OnDeleteMultipleClick(ids: string[]): void {
    this.deleteMultipleNotification.emit(ids);
  }

  // Scroll Handler
  public scrollBottom = output<void>();

  public onScrollBottom(): void {
    this.scrollBottom.emit();
  }

  // Visibility handler

  public itemVisible = output<string>();

  public onItemBecameVisible(itemId: string): void {
    this.itemVisible.emit(itemId);
  }

  // Mobile detection
  private readonly MOBILE_BREAKPOINT = 550;
  private readonly windowWidth = signal(window.innerWidth);

  public isMobile = computed(() => this.windowWidth() < this.MOBILE_BREAKPOINT);

  @HostListener('window:resize')
  onWindowResize(): void {
    this.windowWidth.set(window.innerWidth);
  }

  // Close output for mobile
  public closeModal = output<void>();

  public onCloseClick(): void {
    this.closeModal.emit();
  }
}
