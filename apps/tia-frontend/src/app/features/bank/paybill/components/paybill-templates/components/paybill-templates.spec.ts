import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';
import { TranslateModule } from '@ngx-translate/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  ModalType,
  HeaderCtaAction,
  CrudActionType,
} from '../models/paybill-templates.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';

describe('PaybillTemplates', () => {
  let component: PaybillTemplates;
  let fixture: ComponentFixture<PaybillTemplates>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaybillTemplates,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [provideMockStore(), FormBuilder],
    }).compileComponents();

    fb = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;

    const mockForm = fb.group({
      category: new FormControl(''),
      nickname: new FormControl(''),
    });

    fixture.componentRef.setInput(
      'createGroupForm',
      fb.group({ groupName: '' }),
    );
    fixture.componentRef.setInput('createTemplateForm', mockForm);
    fixture.componentRef.setInput('editTemplateForm', fb.group({}));
    fixture.componentRef.setInput('editGroupForm', fb.group({}));

    fixture.componentRef.setInput('templateGroups', []);
    fixture.componentRef.setInput('templates', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('templateCategories', []);
    fixture.componentRef.setInput('parentProviders', []);
    fixture.componentRef.setInput('paymentFields', []);

    fixture.detectChanges();
  });

  describe('Outputs & Actions', () => {
    it('should emit headerButtonAction when header button is clicked', () => {
      const spy = vi.spyOn(component.headerButtonAction, 'emit');
      component.handleHeaderButtonClick(HeaderCtaAction.CreateGroup);
      expect(spy).toHaveBeenCalledWith(HeaderCtaAction.CreateGroup);
    });

    it('should emit treeAction for all tree operations', () => {
      const spy = vi.spyOn(component.treeAction, 'emit');

      component.onItemDeleteAction('1');
      expect(spy).toHaveBeenCalledWith({ type: 'item-delete', id: '1' });

      component.onGroupEditAction('2');
      expect(spy).toHaveBeenCalledWith({ type: 'group-edit', id: '2' });
    });

    it('should handle CRUD action mapping via internal record', () => {
      const spy = vi.spyOn(component.deleteTemplateModal, 'emit');
      component.onActionHandler(CrudActionType.DeleteTemplate);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form & Modal Logic', () => {
    it('should compute the correct activeForm based on activeModal input', () => {
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      expect(component.activeForm()).toBe(component.createGroupForm());

      fixture.componentRef.setInput('activeModal', ModalType.RenameTemplate);
      expect(component.activeForm()).toBe(component.editTemplateForm());
    });

    it('should emit formSubmit if activeForm is valid', () => {
      const spy = vi.spyOn(component.formSubmit, 'emit');
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      component.createGroupForm().get('groupName')?.setValue('New Group');

      component.onFormSubmit('create-group');

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'create-group' }),
      );
    });
  });

  describe('Signal Reactivity', () => {
    it('should return empty options from getDropdownOptions for unknown controls', () => {
      const options = component.getDropdownOptions('unknown');
      expect(options).toEqual([]);
    });

    it('should emit childProviderSelected when selection changes', () => {
      const spy = vi.spyOn(component.childProviderSelected, 'emit');
      component.onChildProviderChange('p1', 0);
      expect(spy).toHaveBeenCalledWith({ providerId: 'p1', index: 0 });
    });
  });
});
