import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAccountsComponent } from './approve-accounts.component';

describe('ApproveAccountsComponent', () => {
  let component: ApproveAccountsComponent;
  let fixture: ComponentFixture<ApproveAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveAccountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
