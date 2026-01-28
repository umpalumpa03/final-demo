import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [RouterOutlet],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,

  
})
export class Cards {}
