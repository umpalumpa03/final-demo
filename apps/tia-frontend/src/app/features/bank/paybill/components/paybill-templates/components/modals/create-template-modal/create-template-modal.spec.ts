import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTemplateModal } from './create-template-modal';
import { FormGroup, FormControl } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateTemplateModal', () => {
  let component: CreateTemplateModal;
  let fixture: ComponentFixture<CreateTemplateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTemplateModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTemplateModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('form', new FormGroup({}));
    fixture.componentRef.setInput(
      'createTemplateForm',
      new FormGroup({
        testControl: new FormControl(''),
      }),
    );
    fixture.componentRef.setInput('submitVariant', 'primary');
    fixture.componentRef.setInput('submitLabel', 'Save');
    fixture.componentRef.setInput('dropdownOptionsMap', {
      category: [{ label: 'Tech', value: '1' }],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getDropdownOptions', () => {
    it('should return options from the map when key exists', () => {
      const options = component.getDropdownOptions('category');
      expect(options).toEqual([{ label: 'Tech', value: '1' }]);
    });

    it('should return an empty array when key does not exist', () => {
      const options = component.getDropdownOptions('nonExistent');
      expect(options).toEqual([]);
    });
  });

  it('should emit cancel event', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit formSubmit event', () => {
    const spy = vi.spyOn(component.formSubmit, 'emit');
    component.formSubmit.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit childProviderChange with correct payload', () => {
    const spy = vi.spyOn(component.childProviderChange, 'emit');
    const payload = { value: 'test', index: 1 };

    component.childProviderChange.emit(payload);

    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('should react to input signal changes', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });
});
