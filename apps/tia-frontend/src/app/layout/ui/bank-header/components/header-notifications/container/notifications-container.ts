import { Component, inject } from '@angular/core';
import { NotificationsStore } from '../store/notifications.store';

@Component({
  selector: 'app-notifications-container',
  imports: [],
  templateUrl: './notifications-container.html',
  styleUrl: './notifications-container.scss',
})
export class NotificationsContainer {
  readonly store = inject(NotificationsStore);
}
