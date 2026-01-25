import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../shared/navigation/navigation';
import { LibraryHeader } from "../shared/library-header/library-header";

@Component({
  selector: 'app-storybook-container',
  imports: [RouterModule, Navigation, LibraryHeader],
  templateUrl: './storybook.container.html',
  styleUrl: './storybook.container.scss',
})
export class LibraryContainer {
  
}
