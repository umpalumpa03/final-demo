import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-basic-card',
  imports: [],
  templateUrl: './basic-card.html',
  styleUrl: './basic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicCard {
 public readonly title = input<string>();
 public readonly subtitle = input<string>('');
 public readonly content = input<string>('');
 public readonly width = input<string>();
 public readonly height = input<string>();
public readonly hasFooter = input<boolean>(false);
public readonly hasHover = input<boolean>(false);

}