import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { HEADER_CONFIG } from '../../config/user-header.config';

@Component({
  selector: 'app-user-header',
  imports: [BasicCard],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHeader {
  public readonly cfg = HEADER_CONFIG;
}
