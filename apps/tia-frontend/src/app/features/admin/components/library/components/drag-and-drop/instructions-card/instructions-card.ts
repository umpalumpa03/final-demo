import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-instructions-card',
  imports: [],
  templateUrl: './instructions-card.html',
  styleUrl: './instructions-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsCard {}
