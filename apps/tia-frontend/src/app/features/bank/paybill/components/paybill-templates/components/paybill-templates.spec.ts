import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ModalType } from '../models/paybill-templates.model';

describe('PaybillTemplates', () => {
  let component: PaybillTemplates;
  let fixture: ComponentFixture<PaybillTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplates, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PaybillTemplates, {
        set: {
          imports: [ReactiveFormsModule, JsonPipe, TranslateModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('templateGroups', []);
    fixture.componentRef.setInput('templates', []);
    fixture.componentRef.setInput('templateCategories', []);

    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Item Actions', () => {
    it('should emit itemDeleteIcon when onItemDeleteAction is triggered', () => {
      const emitSpy = vi.spyOn(component.itemDeleteIcon, 'emit');
      component.onItemDeleteAction('item-123');
      expect(emitSpy).toHaveBeenCalledWith('item-123');
    });

    it('should emit itemEditIcon when onItemEditAction is triggered', () => {
      const emitSpy = vi.spyOn(component.itemEditIcon, 'emit');
      component.onItemEditAction('item-456');
      expect(emitSpy).toHaveBeenCalledWith('item-456');
    });
  });

  describe('Template Actions', () => {
    it('should NOT emit categorySelected for other controls', () => {
      const spy = vi.spyOn(component.categorySelected, 'emit');
      const mockEvent = { target: { value: 'cat-123' } } as unknown as Event;

      component.onDropdownChange('other-control', mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should NOT emit categorySelected if value is empty', () => {
      const spy = vi.spyOn(component.categorySelected, 'emit');
      const mockEvent = { target: { value: '' } } as unknown as Event;

      component.onDropdownChange('category', mockEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should NOT emit deleteTemplateModal for other actions', () => {
      const emitSpy = vi.spyOn(component.deleteTemplateModal, 'emit');
      component.onActionHandler('someOtherAction');
      component.onActionHandler(undefined);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit categorySelected when category dropdown changes with value', () => {
      const spy = vi.spyOn(component.categorySelected, 'emit');

      const mockEvent = { target: { value: 'cat-123' } } as unknown as Event;

      component.onDropdownChange('category', mockEvent);

      expect(spy).toHaveBeenCalledWith('cat-123');
    });
    it('should return null for unknown modal type', () => {
      fixture.componentRef.setInput('activeModal', null);
      fixture.detectChanges();

      expect(component.activeForm()).toBeNull();
    });
  });
  describe('Signals and Effects', () => {
    it('should set the correct activeForm based on activeModal input', () => {
      fixture.componentRef.setInput('activeModal', ModalType.Template);
      fixture.detectChanges();
      expect(component.activeForm()).toBe(component.createTemplateForm);

      fixture.componentRef.setInput('activeModal', ModalType.Group);
      fixture.detectChanges();
      expect(component.activeForm()).toBe(component.createGroupForm);
    });

    it('should patch the form when currentModalConfig provides initial values', async () => {
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      fixture.componentRef.setInput('currentModalConfig', {
        initialValues: { name: 'Pre-filled Group' },
      });

      // Effects run during change detection
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.createGroupForm.get('name')?.value).toBe(
        'Pre-filled Group',
      );
    });
  });

  describe('Group and Action Handlers', () => {
    it('should emit group actions', () => {
      const editSpy = vi.spyOn(component.groupEditIcon, 'emit');
      const deleteSpy = vi.spyOn(component.groupDeleteIcon, 'emit');

      component.onGroupEditAction('group-1');
      component.onGroupDeleteAction('group-2');

      expect(editSpy).toHaveBeenCalledWith('group-1');
      expect(deleteSpy).toHaveBeenCalledWith('group-2');
    });

    it('should emit correct modals in onActionHandler', () => {
      const delGroupSpy = vi.spyOn(component.deleteGroupModal, 'emit');
      const renGroupSpy = vi.spyOn(component.renameGroupModal, 'emit');
      const editTempSpy = vi.spyOn(component.editTemplateModal, 'emit');

      component.onActionHandler('deleteGroup');
      expect(delGroupSpy).toHaveBeenCalled();

      component.onActionHandler('renameGroup');
      expect(renGroupSpy).toHaveBeenCalled();

      component.onActionHandler('renameTemplate');
      expect(editTempSpy).toHaveBeenCalled();
    });

    it('should emit header actions', () => {
      const spy = vi.spyOn(component.headerButtonAction, 'emit');
      // @ts-ignore - passing string directly for simplicity
      component.handleHeaderButtonClick('create');
      expect(spy).toHaveBeenCalledWith('create');
    });
  });

  describe('Form Logic', () => {
    it('should reset form and emit on toggleModal', () => {
      const spy = vi.spyOn(component.modalOpenAction, 'emit');
      fixture.componentRef.setInput('isModalOpen', true);
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      fixture.detectChanges();

      component.createGroupForm.markAsDirty();
      component.toggleModal();

      expect(component.createGroupForm.pristine).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
