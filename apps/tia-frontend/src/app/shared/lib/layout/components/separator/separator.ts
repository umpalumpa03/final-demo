import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-separator',
  imports: [],
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
  public orientation = input<'horizontal' | 'vertical'>('horizontal');
  public label = input<string | undefined>();
  public color = input<string>();
  public thickness = input<string>('1px');
  public margin = input<string>('1rem');
  

  separatorStyles = computed(() => ({
    '--sep-color': this.color(),
    '--sep-thickness': this.thickness(),
    '--sep-margin': this.margin()
  }));
}
