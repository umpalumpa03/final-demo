import { FormBuilder, Validators } from '@angular/forms';

export function createGroupForm(fb: FormBuilder) {
  return fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
  });
}

export function createTemplateForm(fb: FormBuilder) {
  return fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
  });
}

export function createEditTemplateForm(fb: FormBuilder) {
  return fb.nonNullable.group({
    currentName: [{ value: '', disabled: true }],
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });
}

export function createEditGroupForm(fb: FormBuilder) {
  return fb.nonNullable.group({
    currentName: [{ value: '', disabled: true }],
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });
}

// Export types for type safety
export type GroupForm = ReturnType<typeof createGroupForm>;
export type TemplateForm = ReturnType<typeof createTemplateForm>;
export type EditTemplateForm = ReturnType<typeof createEditTemplateForm>;
export type EditGroupForm = ReturnType<typeof createEditGroupForm>;
