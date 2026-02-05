import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelection } from './language-selection';

describe('LanguageSelection', () => {
  let component: LanguageSelection;
  let fixture: ComponentFixture<LanguageSelection>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelection);
    fixture.componentRef.setInput('languages', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasError', false);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
