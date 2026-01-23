import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  BASIC_INPUT_DEMOS,
  CHECKBOX_DEMOS,
  RADIO_DEMOS,
  SPECIAL_INPUT_DEMOS,
  TEXTAREA_DEMOS,
} from './config/input-demos.config';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { Radios } from '@tia/shared/lib/forms/radios/radios';

@Component({
  selector: 'app-input',
  imports: [LibraryTitle, TextInput, Textarea, Checkboxes, Radios],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  protected readonly basicInputs = signal(BASIC_INPUT_DEMOS);
  protected readonly specialInputTypes = signal(SPECIAL_INPUT_DEMOS);
  protected readonly textareaDemos = signal(TEXTAREA_DEMOS);
  protected readonly checkboxDemos = signal(CHECKBOX_DEMOS);
  protected readonly radioDemos = signal(RADIO_DEMOS);

  public readonly title = 'Input Components';
  public readonly subtitle =
    'Form input components with various types and states';
}
