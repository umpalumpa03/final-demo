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
} from '../../models/paybill-templates.model';
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
    it('should emit childProviderSelected when selection changes', () => {
      const spy = vi.spyOn(component.childProviderSelected, 'emit');
      component.onChildProviderChange('p1', 0);
      expect(spy).toHaveBeenCalledWith({ providerId: 'p1', index: 0 });
    });

    it('should reset form but not patch if initialValues are missing', () => {
      const activeForm = component.createGroupForm();
      const patchSpy = vi.spyOn(activeForm, 'patchValue');

      fixture.componentRef.setInput('activeModal', ModalType.Group);
      fixture.componentRef.setInput('currentModalConfig', {
        initialValues: null,
      });

      fixture.detectChanges();

      expect(patchSpy).not.toHaveBeenCalled();
      expect(activeForm.pristine).toBe(true);
    });
  });

  describe('Tree Actions', () => {
    it('should emit item-edit tree action', () => {
      const spy = vi.spyOn(component.treeAction, 'emit');
      component.onItemEditAction('t-1');
      expect(spy).toHaveBeenCalledWith({ type: 'item-edit', id: 't-1' });
    });

    it('should emit group-delete tree action', () => {
      const spy = vi.spyOn(component.treeAction, 'emit');
      component.onGroupDeleteAction('g-1');
      expect(spy).toHaveBeenCalledWith({ type: 'group-delete', id: 'g-1' });
    });

    it('should emit treeItemMoved when itemMoved is called', () => {
      const spy = vi.spyOn(component.treeItemMoved, 'emit');
      const event = {
        itemId: 't-1',
        fromGroupId: 'g-1',
        toGroupId: 'g-2',
        newOrder: 0,
      };
      component.itemMoved(event);
      expect(spy).toHaveBeenCalledWith(event);
    });
  });

  describe('Payment & Selection', () => {
    it('should emit markedCheckbox when onTemplateChecked is called', () => {
      const spy = vi.spyOn(component.markedCheckbox, 'emit');
      component.onTemplateChecked(['t-1', 't-2']);
      expect(spy).toHaveBeenCalledWith(['t-1', 't-2']);
    });

    it('should emit selectedItem and headerButtonAction on singleItemSelected', () => {
      const itemSpy = vi.spyOn(component.selectedItem, 'emit');
      const headerSpy = vi.spyOn(component.headerButtonAction, 'emit');
      component.singleItemSelected('t-1');
      expect(itemSpy).toHaveBeenCalledWith('t-1');
      expect(headerSpy).toHaveBeenCalledWith(HeaderCtaAction.Pay);
    });

    it('should emit headerButtonAction Pay on paySelected', () => {
      const spy = vi.spyOn(component.headerButtonAction, 'emit');
      component.paySelected();
      expect(spy).toHaveBeenCalledWith(HeaderCtaAction.Pay);
    });

    it('should set isDistribution on paymentTypeChanged', () => {
      component.paymentTypeChanged(true);
      expect(component.isDistribution()).toBe(true);
      component.paymentTypeChanged(false);
      expect(component.isDistribution()).toBe(false);
    });
  });

  describe('OTP Logic', () => {
    it('should emit otpCloseEmit on onOtpClose', () => {
      const spy = vi.spyOn(component.otpCloseEmit, 'emit');
      component.onOtpClose();
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should emit paymentDone on onSuccessDone', () => {
      const spy = vi.spyOn(component.paymentDone, 'emit');
      component.onSuccessDone();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit verifyOtp on onOtpVerify', () => {
      const spy = vi.spyOn(component.verifyOtp, 'emit');
      const otpEvent = { otp: '123456' } as any;
      component.onOtpVerify(otpEvent);
      expect(spy).toHaveBeenCalledWith(otpEvent);
    });
  });

  describe('Action Handler edge cases', () => {
    it('should not throw when onActionHandler receives undefined', () => {
      expect(() => component.onActionHandler(undefined)).not.toThrow();
    });

    it('should call all CRUD action handlers', () => {
      const editSpy = vi.spyOn(component.editTemplateModal, 'emit');
      component.onActionHandler(CrudActionType.RenameTemplate);
      expect(editSpy).toHaveBeenCalled();

      const deleteGroupSpy = vi.spyOn(component.deleteGroupModal, 'emit');
      component.onActionHandler(CrudActionType.DeleteGroup);
      expect(deleteGroupSpy).toHaveBeenCalled();

      const renameGroupSpy = vi.spyOn(component.renameGroupModal, 'emit');
      component.onActionHandler(CrudActionType.RenameGroup);
      expect(renameGroupSpy).toHaveBeenCalled();

      const paySpy = vi.spyOn(component.payAction, 'emit');
      component.onActionHandler(CrudActionType.ConfirmPayment);
      expect(paySpy).toHaveBeenCalled();
    });
  });

  describe('Form Submit edge cases', () => {
    it('should not emit formSubmit if activeForm is invalid', () => {
      const spy = vi.spyOn(component.formSubmit, 'emit');
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      const form = component.createGroupForm();
      form.get('groupName')?.setErrors({ required: true });

      component.onFormSubmit('create-group');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not emit formSubmit for action submit types', () => {
      const spy = vi.spyOn(component.formSubmit, 'emit');
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      component.onFormSubmit('delete-template');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return null activeForm when no modal is active', () => {
      fixture.componentRef.setInput('activeModal', null);
      expect(component.activeForm()).toBeNull();
    });
  });
});
