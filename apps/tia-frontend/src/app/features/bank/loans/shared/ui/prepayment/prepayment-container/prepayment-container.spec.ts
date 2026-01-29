import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentContainer } from './prepayment-container';

describe('PrepaymentContainer', () => {
  let component: PrepaymentContainer;
  let fixture: ComponentFixture<PrepaymentContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
