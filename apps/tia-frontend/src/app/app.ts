import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasicAlerts } from './shared/lib/alerts/basic-alerts/basic-alerts';

@Component({
  imports: [RouterModule, BasicAlerts],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'tia-frontend';
}
