import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-color-switch',
  imports: [],
  templateUrl: './color-switch.html',
  styleUrl: './color-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSwitch {
  public isActive = input<boolean>(false);
  public color = input.required<string>();

  public selected = output<string>();

  public onSelect(): void {
    this.selected.emit(this.color());
    
  }
}
