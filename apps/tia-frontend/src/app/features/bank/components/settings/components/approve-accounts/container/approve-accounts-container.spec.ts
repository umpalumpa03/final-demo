import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAccountsContainer } from './approve-accounts-container';

describe('ApproveAccountsContainer', () => {
  let component: ApproveAccountsContainer;
  let fixture: ComponentFixture<ApproveAccountsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveAccountsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveAccountsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
