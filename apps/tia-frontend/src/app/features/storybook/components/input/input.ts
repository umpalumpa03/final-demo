import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';

import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { Radios } from '@tia/shared/lib/forms/radios/radios';
import { Switches } from '@tia/shared/lib/forms/switches/switches';
import { Slider } from '@tia/shared/lib/forms/sliders/slider';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { InputDemoState } from './state/input-demos.state';

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
    ShowcaseCard,
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [InputDemoState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  protected readonly state = inject(InputDemoState);

  protected readonly basicInputs = this.state.basicInputs;
  protected readonly specialInputTypes = this.state.specialInputTypes;
  protected readonly textareaDemos = this.state.textareaDemos;
  protected readonly checkboxDemos = this.state.checkboxDemos;
  protected readonly radioDemos = this.state.radioDemos;
  protected readonly switchDemos = this.state.switchDemos;
  protected readonly selectDemos = this.state.selectDemos;
  protected readonly sliderDemos = this.state.sliderDemos;
  protected readonly otpDemos = this.state.otpDemos;

  protected readonly pageInfo = this.state.pageInfo;
  protected readonly sectionTitles = this.state.titles;
}
