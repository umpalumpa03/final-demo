import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnLayout } from './column-layout';
import { FormsDemoState } from '../../state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';
const mockFormsDemo = { rowForm: () => ({ firstName: {}, lastName: {}, email: {}, phone: {} }) };

describe('ColumnLayout', () => {
  let fixture: ComponentFixture<ColumnLayout>;
  let component: ColumnLayout;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnLayout, TranslateModule.forRoot()],
      providers: [
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('emits value and resets when form is valid', () => {
    const spy = vi.spyOn(component.twoColumnLayoutForm, 'emit');
    const value = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123',
    };

    component.twoColumnLayoutControl.setValue(value);
    component.submitTwoColumnLayout();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(value);
    expect(component.twoColumnLayoutControl.value.firstName).toBe('');
  });
});