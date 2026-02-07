import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-instructions-card',
  imports: [TranslatePipe],
  templateUrl: './instructions-card.html',
  styleUrl: './instructions-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionsCard {}
