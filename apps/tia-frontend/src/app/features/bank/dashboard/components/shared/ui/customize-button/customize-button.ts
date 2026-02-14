import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customize-button',
  imports: [TranslatePipe],
  templateUrl: './customize-button.html',
  styleUrl: './customize-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeButton {
  public readonly label = input.required<string>();
  public readonly iconClass = input<string>('icon__customize');
  public readonly clicked = output<void>();
  public readonly customMaxSize = input('100%');
  public readonly hideIcon = input(false);
}
