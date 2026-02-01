import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-header',
  imports: [],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHeader {}
