import {
  SelectConfig,
  SelectValue,
} from '@tia/shared/lib/forms/models/dropdowns.model';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';

export interface EditSelectConfig {
  config: SelectConfig;
  options: SelectOption[];
  initialValue: SelectValue | null;
}
