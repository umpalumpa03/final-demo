import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-showcase-card',
  imports: [],
  templateUrl: './showcase-card.html',
  styleUrl: './showcase-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseCard {
  public title = input<string>();
  public subtitle = input<string>();
}
