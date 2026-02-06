import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ModalType,
  HeaderCtaAction,
  CrudActionType,
} from '../models/paybill-templates.model';

describe('PaybillTemplates', () => {
  let component: PaybillTemplates;
  let fixture: ComponentFixture<PaybillTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PaybillTemplates,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('templateGroups', []);
    fixture.componentRef.setInput('templates', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('templateCategories', []);

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

    it('should handle CRUD action mapping', () => {
      const spy = vi.spyOn(component.deleteTemplateModal, 'emit');
      component.onActionHandler(CrudActionType.DeleteTemplate);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form & Modal Logic', () => {
    it('should compute the correct activeForm based on activeModal input', () => {
      fixture.componentRef.setInput('activeModal', ModalType.Group);
      expect(component.activeForm()).toBe(component['createGroupForm']);

      fixture.componentRef.setInput('activeModal', ModalType.RenameTemplate);
      expect(component.activeForm()).toBe(component['editTemplateForm']);
    });

    it('should emit formSubmit only if form is valid', () => {
      const spy = vi.spyOn(component.formSubmit, 'emit');
      fixture.componentRef.setInput('activeModal', ModalType.Group);

      component.onFormSubmit('create-group');
      expect(spy).not.toHaveBeenCalled();

      // Make form valid
      component.activeForm()?.patchValue({ name: 'Test Group' });
      component.onFormSubmit('create-group');

      expect(spy).toHaveBeenCalledWith({
        type: 'create-group',
        values: expect.objectContaining({ name: 'Test Group' }),
      });
    });
  });

  describe('Effects', () => {
    it('should patch form values when currentModalConfig changes', async () => {
      fixture.componentRef.setInput('activeModal', ModalType.RenameGroup);
      fixture.detectChanges();

      fixture.componentRef.setInput('currentModalConfig', {
        initialValues: { name: 'Old Name' },
      });
      fixture.detectChanges();
      await fixture.whenStable();

      const activeFormValue = component.activeForm()?.value;

      expect(activeFormValue).toEqual(
        expect.objectContaining({
          name: 'Old Name',
        }),
      );
    });
  });
});
