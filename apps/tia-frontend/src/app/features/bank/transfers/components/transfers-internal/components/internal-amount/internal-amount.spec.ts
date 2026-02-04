import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalAmount } from './internal-amount';

describe('InternalAmount', () => {
  let component: InternalAmount;
  let fixture: ComponentFixture<InternalAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalAmount],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalAmount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
