import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Forms } from './forms';
import { FormsDemoState } from './state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';

const mockFormsDemo = {
  pageInfo: () => ({ title: 'Forms', subtitle: 'Subtitle' }),
  titles: () => ({
    contact: 'Contact',
    registration: 'Registration',
    settings: 'Settings',
    inline: 'Inline',
    validation: 'Validation',
    multiStep: 'MultiStep',
    layout: 'Layout',
  }),
};

describe('Forms', () => {
  let component: Forms;
  let fixture: ComponentFixture<Forms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forms, TranslateModule.forRoot()],
      providers: [
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Forms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
