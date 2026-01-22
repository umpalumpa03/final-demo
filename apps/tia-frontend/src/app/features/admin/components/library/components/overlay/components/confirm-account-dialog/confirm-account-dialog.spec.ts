import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAccountDialog } from './confirm-account-dialog';

describe('ConfirmAccountDialog', () => {
  let component: ConfirmAccountDialog;
  let fixture: ComponentFixture<ConfirmAccountDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAccountDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
