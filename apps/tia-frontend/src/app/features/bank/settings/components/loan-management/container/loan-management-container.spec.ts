import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanManagementContainer } from './loan-management-container';

describe('LoanManagementContainer', () => {
  let component: LoanManagementContainer;
  let fixture: ComponentFixture<LoanManagementContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanManagementContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanManagementContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
