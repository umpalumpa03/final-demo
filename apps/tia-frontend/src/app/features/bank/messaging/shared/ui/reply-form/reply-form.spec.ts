import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplyForm } from './reply-form';
import { TranslateModule } from '@ngx-translate/core';

describe('ReplyForm', () => {
  let component: ReplyForm;
  let fixture: ComponentFixture<ReplyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyForm, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty body field', () => {
    expect(component.form.get('body')?.value).toBe('');
  });

  it('should have body field with required validator', () => {
    const bodyControl = component.form.get('body');
    expect(bodyControl?.hasError('required')).toBe(true);
    
    bodyControl?.setValue('Some reply text');
    expect(bodyControl?.hasError('required')).toBe(false);
  });

  it('should emit sendReply with form body value when form is valid', () => {
    let emittedValue: string | undefined;
    component.sendReply.subscribe((value) => {
      emittedValue = value;
    });

    component.form.patchValue({ body: 'Test reply message' });
    component.onSendReply();

    expect(emittedValue).toBe('Test reply message');
  });

  it('should reset form after sending reply', () => {
    component.form.patchValue({ body: 'Test reply message' });
    component.onSendReply();

    expect(component.form.get('body')?.value).toBe(null);
  });

  it('should not emit sendReply when form is invalid', () => {
    let emitted = false;
    component.sendReply.subscribe(() => {
      emitted = true;
    });

    component.form.patchValue({ body: '' });
    component.onSendReply();

    expect(emitted).toBe(false);
  });
});