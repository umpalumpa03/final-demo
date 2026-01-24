import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  BASIC_INPUT_DEMOS,
  CHECKBOX_DEMOS,
  RADIO_DEMOS,
  SLIDER_DEMOS,
  SELECT_DEMOS,
  SPECIAL_INPUT_DEMOS,
  SWITCH_DEMOS,
  TEXTAREA_DEMOS,
  OTP_DEMOS,
} from './config/input-demos.config';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { Radios } from '@tia/shared/lib/forms/radios/radios';
import { Switches } from '@tia/shared/lib/forms/switches/switches';
import { Slider } from '@tia/shared/lib/forms/sliders/slider';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { Otp } from '@tia/shared/lib/forms/otp/otp';

@Component({
  selector: 'app-input',
  imports: [
    LibraryTitle,
    TextInput,
    Textarea,
    Checkboxes,
    Radios,
    Switches,
    Slider,
    Dropdowns,
    Otp,
  ],
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
  protected readonly switchDemos = signal(SWITCH_DEMOS);
  protected readonly selectDemos = signal(SELECT_DEMOS);
  protected readonly sliderDemos = signal(SLIDER_DEMOS);
  protected readonly otpDemos = signal(OTP_DEMOS);

  public readonly title = 'Input Components';
  public readonly subtitle =
    'Form input components with various types and states';
}
