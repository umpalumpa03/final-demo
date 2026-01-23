import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-separator',
  imports: [],
  templateUrl: './separator.html',
  styleUrls: ['./separator.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Separator {
  public orientation = input<'horizontal' | 'vertical'>('horizontal');
  public label = input<string | undefined>();
  public thickness = input<string>('1px');
  public margin = input<string>('');

  public separatorStyles = computed(() => ({
    '--sep-thickness': this.thickness(),
    '--sep-margin': this.margin(),
  }));
}
