import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account-container',
  imports: [],
  templateUrl: './account-container.html',
  styleUrl: './account-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountContainer {}
