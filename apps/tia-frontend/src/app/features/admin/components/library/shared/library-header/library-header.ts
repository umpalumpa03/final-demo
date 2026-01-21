import { Component, input } from '@angular/core';

@Component({
  selector: 'app-library-header',
  imports: [],
  templateUrl: './library-header.html',
  styleUrl: './library-header.scss',
})
export class LibraryHeader {
  public title = input.required<string>();
  public subtitle = input<string>();
}
