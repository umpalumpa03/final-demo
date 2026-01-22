import { computed } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export const getErrorMessage = (
  control: AbstractControl | null,
  label: string,
) =>
  computed(() => {
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return `${label} is required`;
    }

    if (control.hasError('minlength')) {
      return `min length of ${label} is ${control.errors?.['minlength']?.requiredLength}`;
    }

    return '';
  });
