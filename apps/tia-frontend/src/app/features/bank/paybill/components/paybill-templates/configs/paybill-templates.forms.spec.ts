import { FormBuilder } from '@angular/forms';

import {
  createEditGroupForm,
  createEditTemplateForm,
  createGroupForm,
  createTemplateForm,
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

    it('should be invalid when name is empty', () => {
      const form = createEditTemplateForm(fb);
      expect(form.controls.name.value).toBe('');
      expect(form.controls.name.hasError('required')).toBe(true);
    });
  });

  describe('createTemplateForm', () => {
    it('should initialize with empty values and be invalid', () => {
      const form = createTemplateForm(fb);
      expect(form.controls.name.value).toBe('');
      expect(form.controls.category.value).toBe('');
      expect(form.valid).toBe(false);
    });

    it('should be valid when name and category are provided', () => {
      const form = createTemplateForm(fb);
      form.controls.name.setValue('My Template');
      form.controls.category.setValue('utilities');
      expect(form.valid).toBe(true);
    });

    it('should be invalid if name is less than 2 characters', () => {
      const form = createTemplateForm(fb);
      form.controls.name.setValue('a');
      form.controls.category.setValue('utilities');
      expect(form.controls.name.hasError('minlength')).toBe(true);
    });
  });

  describe('createEditGroupForm', () => {
    it('should have currentName disabled by default', () => {
      const form = createEditGroupForm(fb);
      expect(form.controls.currentName.disabled).toBe(true);
    });

    it('should be invalid when name exceeds 50 characters', () => {
      const form = createEditGroupForm(fb);
      form.controls.name.setValue('a'.repeat(51));
      expect(form.controls.name.hasError('maxlength')).toBe(true);
    });
  });
});
