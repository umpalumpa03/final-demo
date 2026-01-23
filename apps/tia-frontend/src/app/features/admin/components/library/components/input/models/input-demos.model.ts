import {
  TextInputType,
  InputState,
  InputConfig,
} from '@tia/shared/lib/forms/models/input.model';
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
