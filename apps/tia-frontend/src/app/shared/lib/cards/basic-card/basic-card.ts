import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-basic-card',
  imports: [],
  templateUrl: './basic-card.html',
  styleUrl: './basic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly content = input<string>('');
}
