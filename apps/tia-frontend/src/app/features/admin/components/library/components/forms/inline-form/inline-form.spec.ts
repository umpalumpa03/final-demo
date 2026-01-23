import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InlineForm } from './inline-form';

describe('InlineForm', () => {
  let component: InlineForm;
  let fixture: ComponentFixture<InlineForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
