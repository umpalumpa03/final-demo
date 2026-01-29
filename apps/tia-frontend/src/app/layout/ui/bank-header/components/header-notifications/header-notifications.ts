import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { ItemsData } from '../../models/notification.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { NotificationsStore } from '../../store/notifications.store';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-header-notifications',
  imports: [
    ScrollArea,
    DatePipe,
    Checkboxes,
    TitleCasePipe,
    RouteLoader,
    ButtonComponent,
  ],
  templateUrl: './header-notifications.html',
  styleUrl: './header-notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifications {
  readonly store = inject(NotificationsStore);

  public isOpen = input<boolean>();
  public messages = input();
  public anchor = input<ElementRef | undefined>();

  // Store working
  public notificationsItems = this.store.items;
  public isLoading = this.store.isLoading;
  public hasError = this.store.hasError;
  public unreadLeft = this.store.unreadNotificationsNumber;

  public top = signal(0);
  public left = signal(0);

  public isAllSelected = computed(() => {
    return this.notificationsItems().length === this.selectedItems().length;
  });
  public selectedItems = signal<string[]>([]);

  constructor() {
    effect(() => {
      const anchorEl = this.anchor();
      const open = this.isOpen();

      if (!anchorEl || !open) return;

      const rect = anchorEl.nativeElement.getBoundingClientRect();

      this.top.set(rect.bottom + window.scrollY);
      this.left.set(rect.right - 380);
    });
  }

  public toggleSelectAll(messages: ItemsData[]) {
    if (this.isAllSelected()) {
      this.selectedItems.set([]);
    } else {
      this.selectedItems.set(messages.map((item) => item.id));
    }
  }

  public individualItemSelection(id: string) {
    this.selectedItems.update((items) => {
      const exists = items.includes(id);

      if (exists) {
        return items.filter((itemId) => itemId !== id);
      }

      return [...items, id];
    });
  }

  public isItemSelected(id: string) {
    return this.selectedItems().includes(id);
  }

  public onTrashIconClick(id: string) {
    this.store.deleteNotification(id);
  }

  public onReadIconClicked(id: string) {
    this.store.markItemRead(id);
  }

  public onMarkAllClick() {
    this.store.markAllAsRead();
  }

  // public onScrollBottom() {
  //   if (this.store.pageInfo.hasNext()) {
  //     this.store.fetchNotifications({
  //       cursor: this.store.pageInfo.nextCursor(),
  //       limit: this.store.limitPerPage(),
  //     });
  //   }
  // }
}
