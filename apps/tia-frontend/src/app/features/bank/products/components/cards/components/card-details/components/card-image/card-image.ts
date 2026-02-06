import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.html',
  styleUrls: ['./card-image.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardImage {
  readonly imageBase64 = input.required<string>();
  readonly cardName = input.required<string>();
}