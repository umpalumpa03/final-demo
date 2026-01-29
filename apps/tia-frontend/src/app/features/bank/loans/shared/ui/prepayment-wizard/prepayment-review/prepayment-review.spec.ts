import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentReview } from './prepayment-review';

describe('PrepaymentReview', () => {
  let component: PrepaymentReview;
  let fixture: ComponentFixture<PrepaymentReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentReview],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
