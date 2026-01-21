import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation';

@Component({
  selector: 'app-library-container',
  imports: [RouterModule, Navigation],
  templateUrl: './library-container.html',
  styleUrl: './library-container.scss',
})
export class LibraryContainer {
  
}
