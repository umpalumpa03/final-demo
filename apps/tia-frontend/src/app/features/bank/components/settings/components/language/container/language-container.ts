import { Component } from '@angular/core';
import { LanguageComponent } from '../components/language.component';

@Component({
  selector: 'app-language-container',
  imports: [LanguageComponent],
  templateUrl: './language-container.html',
  styleUrl: './language-container.scss',
})
export class LanguageContainer {
}

