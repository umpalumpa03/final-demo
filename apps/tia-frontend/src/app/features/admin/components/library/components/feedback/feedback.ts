import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {}
