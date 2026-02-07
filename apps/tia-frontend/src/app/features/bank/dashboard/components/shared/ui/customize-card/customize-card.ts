import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customize-card',
  imports: [TranslatePipe],
  templateUrl: './customize-card.html',
  styleUrl: './customize-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeCard {
  public readonly title = input.required<string>();
  public readonly iconPath = input.required<string>();
  public readonly isSelected = input<boolean>(true);
  public readonly selectionChange = output<boolean>();

  protected toggle(): void {
    this.selectionChange.emit(!this.isSelected());
  }
}
