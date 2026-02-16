import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../shared/lib/primitives/button/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-wild-card',
  imports: [ButtonComponent,RouterLink,TranslatePipe],
  templateUrl: './wild-card.html',
  styleUrls: ['./wild-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WildCardComponent {
}
