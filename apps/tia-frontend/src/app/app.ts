import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextInput } from './shared/lib/forms/input-field/text-input/text-input';

@Component({
  imports: [RouterModule, TextInput],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'tia-frontend';
}
