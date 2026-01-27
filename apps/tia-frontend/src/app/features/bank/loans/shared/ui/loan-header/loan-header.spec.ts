import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanHeader } from './loan-header';

describe('LoanHeader', () => {
  let component: LoanHeader;
  let fixture: ComponentFixture<LoanHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
