import {
  TextInputType,
  InputState,
  InputConfig,
} from '@tia/shared/lib/forms/models/input.model';

export interface InputDemo {
  type?: TextInputType;
  state?: InputState;
  config: InputConfig;
}
