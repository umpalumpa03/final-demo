import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-card',
  imports: [TranslatePipe],
  templateUrl: './empty-card.html',
  styleUrl: './empty-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyCard {}
