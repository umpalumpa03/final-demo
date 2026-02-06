import { FormBuilder } from '@angular/forms';

import {
  createEditTemplateForm,
  createGroupForm,
} from './paybill-templates.forms';

describe('Form Factory Functions', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('createGroupForm', () => {
    it('should initialize with an empty string and be invalid', () => {
      const form = createGroupForm(fb);
      expect(form.controls.name.value).toBe('');
      expect(form.valid).toBe(false);
    });

    it('should be valid when name is between 3 and 50 characters', () => {
      const form = createGroupForm(fb);
      const nameControl = form.controls.name;

      nameControl.setValue('Valid Name');
      expect(nameControl.valid).toBe(true);
    });

    it('should be invalid if name is less than 3 characters', () => {
      const form = createGroupForm(fb);
      const nameControl = form.controls.name;

      nameControl.setValue('ab');
      expect(nameControl.hasError('minlength')).toBe(true);
    });
  });

  describe('createEditTemplateForm', () => {
    it('should have currentName disabled by default', () => {
      const form = createEditTemplateForm(fb);
      expect(form.controls.currentName.disabled).toBe(true);
    });
  });
});
