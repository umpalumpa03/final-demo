import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-color-switch',
  imports: [],
  templateUrl: './color-switch.html',
  styleUrl: './color-switch.scss',
})
export class ColorSwitch {
  public isActive = input<boolean>(false);
  public color = input.required<string>();
}
