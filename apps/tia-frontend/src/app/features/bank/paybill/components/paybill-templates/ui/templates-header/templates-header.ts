import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  HeaderCtaAction,
  HeaderCtaButton,
} from '../../models/paybill-templates.model';
import { SelectedItems } from '../selected-items/selected-items';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-templates-header',
  imports: [SelectedItems, ButtonComponent, LibraryTitle, TranslatePipe],
  templateUrl: './templates-header.html',
  styleUrl: './templates-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesHeader {
  public headerButtons = input.required<HeaderCtaButton[]>();
  public showSelectedItems = input<boolean>(false);

  public buttonClick = output<HeaderCtaAction>();
  public paySelected = output<void>();
}
