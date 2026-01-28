import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-details',
  imports: [],
  templateUrl: './card-details.html',
  styleUrl: './card-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetails {}
