import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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

  describe('Group Actions', () => {
    it('should emit GroupEditIcon when onGroupEditAction is triggered', () => {
      const emitSpy = vi.spyOn(component.GroupEditIcon, 'emit');
      component.onGroupEditAction('group-1');
      expect(emitSpy).toHaveBeenCalledWith('group-1');
    });

    it('should emit GroupDeleteIcon when onGroupDeleteAction is triggered', () => {
      const emitSpy = vi.spyOn(component.GroupDeleteIcon, 'emit');
      component.onGroupDeleteAction('group-2');
      expect(emitSpy).toHaveBeenCalledWith('group-2');
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
    it('should emit deleteTemplateModal with "asd" when action is "deleteTemplate"', () => {
      const emitSpy = vi.spyOn(component.deleteTemplateModal, 'emit');
      component.onActionHandler('deleteTemplate');

      expect(emitSpy).toHaveBeenCalledWith('asd');
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
});
