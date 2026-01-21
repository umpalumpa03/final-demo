import { Component, input } from '@angular/core';

@Component({
  selector: 'app-showcase-card',
  imports: [],
  templateUrl: './showcase-card.html',
  styleUrl: './showcase-card.scss',
})
export class ShowcaseCard {
  public title = input<string>();
}
