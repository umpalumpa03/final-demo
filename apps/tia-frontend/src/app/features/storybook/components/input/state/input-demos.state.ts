import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CheckboxDemo,
  InputDemo,
  OtpDemo,
  RadioDemo,
  SelectDemo,
  SliderDemo,
  SpecialInputDemo,
  SwitchDemo,
  TextareaDemo,
} from '../models/input-demos.model';

@Injectable()
export class InputDemoState {
  private readonly translate = inject(TranslateService);

  public readonly pageInfo = signal({
    title: this.translate.instant('storybook.inputs.title'),
    subtitle: this.translate.instant('storybook.inputs.subtitle'),
  });

  public readonly basicInputs = signal<InputDemo[]>([
    {
      config: {
        label: this.translate.instant(
          'storybook.inputs.textInput.default.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textInput.default.placeholder',
        ),
      },
    },
    {
      state: 'disabled',
      config: {
        label: this.translate.instant(
          'storybook.inputs.textInput.disabled.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textInput.disabled.placeholder',
        ),
      },
    },
    {
      state: 'readonly',
      config: {
        label: this.translate.instant(
          'storybook.inputs.textInput.readonly.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textInput.readonly.placeholder',
        ),
      },
    },
    {
      state: 'error',
      config: {
        label: this.translate.instant('storybook.inputs.textInput.error.label'),
        placeholder: this.translate.instant(
          'storybook.inputs.textInput.error.placeholder',
        ),
        errorMessage: this.translate.instant(
          'storybook.inputs.textInput.error.errorMessage',
        ),
      },
    },
    {
      state: 'success',
      config: {
        label: this.translate.instant(
          'storybook.inputs.textInput.success.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textInput.success.placeholder',
        ),
        successMessage: this.translate.instant(
          'storybook.inputs.textInput.success.successMessage',
        ),
      },
    },
  ]);

  public readonly specialInputTypes = signal<SpecialInputDemo[]>([
    {
      type: 'email',
      label: this.translate.instant('storybook.inputs.specialInput.email'),
      placeholder: 'Type here...',
      validation: { email: true },
    },
    {
      type: 'password',
      label: this.translate.instant('storybook.inputs.specialInput.password'),
    },
    {
      type: 'search',
      label: this.translate.instant('storybook.inputs.specialInput.search'),
    },
    {
      type: 'number',
      label: this.translate.instant('storybook.inputs.specialInput.number'),
    },
    {
      type: 'date',
      label: this.translate.instant('storybook.inputs.specialInput.date'),
    },
    {
      type: 'time',
      label: this.translate.instant('storybook.inputs.specialInput.time'),
    },
    {
      type: 'color',
      label: this.translate.instant('storybook.inputs.specialInput.color'),
    },
    {
      type: 'file',
      label: this.translate.instant('storybook.inputs.specialInput.file'),
    },
    {
      type: 'url',
      label: this.translate.instant('storybook.inputs.specialInput.url'),
    },
    {
      type: 'tel',
      label: this.translate.instant('storybook.inputs.specialInput.phone'),
    },
  ]);

  public readonly textareaDemos = signal<TextareaDemo[]>([
    {
      config: {
        label: this.translate.instant(
          'storybook.inputs.textarea.default.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textarea.default.placeholder',
        ),
        showCharacterCount: true,
      },
    },
    {
      state: 'disabled',
      config: {
        label: this.translate.instant(
          'storybook.inputs.textarea.disabled.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textarea.disabled.placeholder',
        ),
      },
    },
    {
      config: {
        label: this.translate.instant(
          'storybook.inputs.textarea.maxLength.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.textarea.maxLength.placeholder',
        ),
        validation: { maxLength: 100 },
        showCharacterCount: true,
      },
    },
  ]);

  public readonly checkboxDemos = signal<CheckboxDemo[]>([
    {
      checked: false,
      config: {
        label: this.translate.instant('storybook.inputs.checkboxes.terms'),
      },
    },
    {
      checked: true,
      config: {
        label: this.translate.instant('storybook.inputs.checkboxes.default'),
      },
    },
    {
      checked: false,
      config: {
        label: this.translate.instant('storybook.inputs.checkboxes.disabled'),
        disabled: true,
      },
    },
    {
      checked: true,
      config: {
        label: this.translate.instant(
          'storybook.inputs.checkboxes.disabledChecked',
        ),
        disabled: true,
      },
    },
  ]);

  public readonly radioDemos = signal<RadioDemo[]>([
    {
      config: {
        layout: 'column',
        initialValue: 1,
      },
      options: [
        {
          label: this.translate.instant('storybook.inputs.radio.opt1'),
          value: 1,
        },
        {
          label: this.translate.instant('storybook.inputs.radio.opt2'),
          value: 2,
        },
        {
          label: this.translate.instant('storybook.inputs.radio.opt3'),
          value: 3,
        },
        {
          label: this.translate.instant('storybook.inputs.radio.optDisabled'),
          value: 4,
          disabled: true,
        },
      ],
    },
  ]);

  public readonly switchDemos = signal<SwitchDemo[]>([
    {
      checked: false,
      config: {
        label: this.translate.instant('storybook.inputs.switches.toggle'),
      },
    },
    {
      checked: true,
      config: {
        label: this.translate.instant('storybook.inputs.switches.default'),
      },
    },
    {
      checked: false,
      config: {
        label: this.translate.instant('storybook.inputs.switches.disabled'),
        disabled: true,
      },
    },
    {
      checked: true,
      config: {
        label: this.translate.instant(
          'storybook.inputs.switches.disabledChecked',
        ),
        disabled: true,
      },
    },
  ]);

  public readonly selectDemos = signal<SelectDemo[]>([
    {
      config: {
        label: this.translate.instant(
          'storybook.inputs.dropdown.default.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.dropdown.default.placeholder',
        ),
      },
      initialValue: null,
      options: [
        {
          label: this.translate.instant(
            'storybook.inputs.dropdown.options.opt1',
          ),
          value: 1,
        },
        {
          label: this.translate.instant(
            'storybook.inputs.dropdown.options.opt2',
          ),
          value: 2,
        },
        {
          label: this.translate.instant(
            'storybook.inputs.dropdown.options.opt3',
          ),
          value: 3,
        },
      ],
    },
    {
      config: {
        label: this.translate.instant(
          'storybook.inputs.dropdown.disabled.label',
        ),
        placeholder: this.translate.instant(
          'storybook.inputs.dropdown.disabled.placeholder',
        ),
        disabled: true,
      },
      initialValue: null,
      options: [],
    },
  ]);

  public readonly sliderDemos = signal<SliderDemo[]>([
    {
      config: {
        label: this.translate.instant('storybook.inputs.sliders.volume'),
        valueSuffix: '%',
        min: 0,
        max: 100,
      },
      initialValue: 50,
    },
    {
      config: {
        label: this.translate.instant('storybook.inputs.sliders.disabled'),
        disabled: true,
      },
      initialValue: 50,
    },
    {
      config: {
        label: this.translate.instant('storybook.inputs.sliders.step'),
        step: 25,
        valueSuffix: '%',
      },
      initialValue: 50,
    },
  ]);

  public readonly otpDemos = signal<OtpDemo[]>([
    {
      initialValue: '',
      config: {
        label: this.translate.instant('storybook.inputs.otp.label'),
        length: 6,
        inputType: 'number',
      },
    },
  ]);

  public readonly titles = signal({
    textInput: this.translate.instant('storybook.inputs.textInput.title'),
    specialInput: this.translate.instant('storybook.inputs.specialInput.title'),
    textarea: this.translate.instant('storybook.inputs.textarea.title'),
    checkboxes: this.translate.instant('storybook.inputs.checkboxes.title'),
    radio: this.translate.instant('storybook.inputs.radio.title'),
    switches: this.translate.instant('storybook.inputs.switches.title'),
    dropdown: this.translate.instant('storybook.inputs.dropdown.title'),
    sliders: this.translate.instant('storybook.inputs.sliders.title'),
    otp: this.translate.instant('storybook.inputs.otp.title'),
  });
}
