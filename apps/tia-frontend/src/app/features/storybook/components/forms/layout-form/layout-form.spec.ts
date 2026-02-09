import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutForm } from './layout-form';
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';
const mockFormsDemo = {
  rowForm: () => ({ firstName: {}, lastName: {}, email: {}, phone: {} }),
  horizontalForm: () => ({ firstName: {}, message: {}, email: {} }),
};

describe('LayoutForm', () => {
  let component: LayoutForm;
  let fixture: ComponentFixture<LayoutForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutForm, TranslateModule.forRoot()],
      providers: [
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
