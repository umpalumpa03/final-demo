import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ModalType } from '../../../../../paybill-templates/models/paybill-templates.model';
import { PaybillTemplates } from '../../../../../paybill-templates/components/paybill-templates';

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
      providers: [provideMockStore(), FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;

    const fb = TestBed.inject(FormBuilder);
    fixture.componentRef.setInput('createGroupForm', fb.group({}));
    fixture.componentRef.setInput('createTemplateForm', fb.group({}));
    fixture.componentRef.setInput('editTemplateForm', fb.group({}));
    fixture.componentRef.setInput('editGroupForm', fb.group({}));
    fixture.componentRef.setInput('templateGroups', []);
    fixture.componentRef.setInput('templates', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('parentProviders', []);
    fixture.componentRef.setInput('templateCategories', []);
    fixture.componentRef.setInput('paymentFields', []);

    fixture.detectChanges();
  });

  it('activeForm: should compute correctly based on activeModal', () => {
    fixture.componentRef.setInput('activeModal', ModalType.Group);
    expect(component.activeForm()).toBe(component.createGroupForm());
  });
});
