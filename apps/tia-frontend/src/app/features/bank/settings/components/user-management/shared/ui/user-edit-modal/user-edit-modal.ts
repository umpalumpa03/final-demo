import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-edit-modal',
  imports: [],
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditModal {}
