import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColumnLayout } from './column-layout/column-layout';
import { HorizontalLayout } from './horizontal-layout/horizontal-layout';

@Component({
  selector: 'app-layout-form',
  imports: [ColumnLayout, HorizontalLayout],
  templateUrl: './layout-form.html',
  styleUrls: ['./layout-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutForm {}
