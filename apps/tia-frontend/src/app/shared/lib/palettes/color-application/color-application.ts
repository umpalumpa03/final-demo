import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { colorApplication } from '../../../../features/admin/components/library/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-color-application',
  imports: [],
  templateUrl: './color-application.html',
  styleUrl: './color-application.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorApplication {
  public readonly theme = input<string>();
  public readonly themeLabel = input<string>();
  public readonly applications = computed(
    () =>
      colorApplication[this.theme() as keyof typeof colorApplication] ??
      colorApplication.oceanblue,
  );
}
