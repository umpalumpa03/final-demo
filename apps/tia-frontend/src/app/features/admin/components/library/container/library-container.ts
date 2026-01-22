import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation';
import { LibraryHeader } from "../shared/library-header/library-header";

@Component({
  selector: 'app-library-container',
  imports: [RouterModule, Navigation, LibraryHeader],
  templateUrl: './library-container.html',
  styleUrl: './library-container.scss',
})
export class LibraryContainer {
  
}
