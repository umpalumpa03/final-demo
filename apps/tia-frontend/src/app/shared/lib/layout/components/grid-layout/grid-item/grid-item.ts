import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grid-item',
  imports: [],
  templateUrl: './grid-item.html',
  styleUrl: './grid-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridItem {}
