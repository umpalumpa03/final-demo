import { Component } from '@angular/core';
import { ColorSwitch } from "apps/tia-frontend/src/app/shared/lib/color-switching-buttons/color-switch/color-switch";

@Component({
  selector: 'app-library-header',
  imports: [ColorSwitch],
  templateUrl: './library-header.html',
  styleUrl: './library-header.scss',
})
export class LibraryHeader {}
