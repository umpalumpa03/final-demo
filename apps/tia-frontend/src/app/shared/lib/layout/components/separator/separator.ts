import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-separator',
  imports: [NgStyle],
  templateUrl: './separator.html',
  styleUrls: ['./separator.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.vertical]': 'orientation() === "vertical"',
    '[class.horizontal]': 'orientation() === "horizontal"',
    'role': 'separator',
    '[attr.aria-orientation]': 'orientation()'
  }
})
export class Separator {
  // Inputs using Signals
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  label = input<string | undefined>();
  color = input<string>();
  thickness = input<string>('1px');
  margin = input<string>('1rem');
  

  // Computed styles to pass to the template
  separatorStyles = computed(() => ({
    '--sep-color': this.color(),
    '--sep-thickness': this.thickness(),
    '--sep-margin': this.margin()
  }));
}
