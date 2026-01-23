import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextInput } from 'apps/tia-frontend/src/app/shared/lib/forms/input-field/text-input/text-input';
import {
  BASIC_INPUT_DEMOS,
  SPECIAL_INPUT_DEMOS,
} from './config/input-demos.config';
import { LibraryTitle } from "../../shared/library-title/library-title";

@Component({
  selector: 'app-input',
  imports: [CommonModule, TextInput, LibraryTitle],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  protected readonly basicInputs = signal(BASIC_INPUT_DEMOS);
  protected readonly specialInputTypes = signal(SPECIAL_INPUT_DEMOS);
  public readonly title = 'Input Components';
  public readonly subtitle =
    'Form input components with various types and states';
}
