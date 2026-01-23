import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  BASIC_INPUT_DEMOS,
  SPECIAL_INPUT_DEMOS,
} from './config/input-demos.config';

@Component({
  selector: 'app-input',
  imports: [CommonModule, TextInput],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  protected readonly basicInputs = signal(BASIC_INPUT_DEMOS);
  protected readonly specialInputTypes = signal(SPECIAL_INPUT_DEMOS);
}
