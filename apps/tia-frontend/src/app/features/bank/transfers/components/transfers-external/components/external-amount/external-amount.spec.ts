import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';

describe('ExternalAmount', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalAmount],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
