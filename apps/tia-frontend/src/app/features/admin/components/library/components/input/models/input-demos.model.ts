import { CheckboxConfig } from '@tia/shared/lib/forms/models/checkbox.model';
import {
  TextInputType,
  InputState,
  InputConfig,
} from '@tia/shared/lib/forms/models/input.model';
import {
  RadioGroupConfig,
  RadioOption,
} from '@tia/shared/lib/forms/models/radios.model';
import { SliderConfig } from '@tia/shared/lib/forms/models/slider.model';
import { SwitchConfig } from '@tia/shared/lib/forms/models/switches.model';
import { TextareaConfig } from '@tia/shared/lib/forms/models/textarea.model';

export interface InputDemo {
  type?: TextInputType;
  state?: InputState;
  config: InputConfig;
}

export interface TextareaDemo {
  state?: InputState;
  config: TextareaConfig;
}

export interface CheckboxDemo {
  checked: boolean;
  config: CheckboxConfig;
}

export interface RadioDemo {
  config: RadioGroupConfig;
  options: RadioOption[];
}

export interface SwitchDemo {
  checked: boolean;
  config: SwitchConfig;
}

export interface SliderDemo {
  config: SliderConfig;
  initialValue: number;
}
