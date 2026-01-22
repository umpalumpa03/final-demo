import { TextInputType, InputState, InputConfig } from "@tia/shared/lib/forms/input-field/models/input.model";

export interface InputDemo {
  type?: TextInputType;
  state?: InputState;
  config: InputConfig;
}
