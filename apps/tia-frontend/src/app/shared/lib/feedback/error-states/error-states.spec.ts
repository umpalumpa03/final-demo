import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStates } from './error-states';

describe('ErrorStates', () => {
  let component: ErrorStates;
  let fixture: ComponentFixture<ErrorStates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStates],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
