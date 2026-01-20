import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DragAndDropContainer } from "./features/admin/components/library/components/drag-and-drop/drag-and-drop";

@Component({
  imports: [RouterModule, DragAndDropContainer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'tia-frontend';
}
