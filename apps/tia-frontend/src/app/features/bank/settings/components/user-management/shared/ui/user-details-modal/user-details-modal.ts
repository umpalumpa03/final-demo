import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-details-modal',
  imports: [],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {}
