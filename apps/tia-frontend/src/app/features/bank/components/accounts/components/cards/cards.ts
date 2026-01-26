import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,

  
})
export class Cards {}
