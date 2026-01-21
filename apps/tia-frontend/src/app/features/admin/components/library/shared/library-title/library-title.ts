import { Component, input } from '@angular/core';

@Component({
  selector: 'app-library-title',
  templateUrl: './library-title.html',
  styleUrl: './library-title.scss',
})
export class LibraryTitle {
  public title = input.required<string>();
  public subtitle = input<string>();
}
