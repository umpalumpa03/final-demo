import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from "../../../../../../../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-cards',
  imports: [RouterOutlet],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,

  
})
export class Cards {}
