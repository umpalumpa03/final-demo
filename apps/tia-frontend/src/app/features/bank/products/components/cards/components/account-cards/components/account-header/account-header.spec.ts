import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountHeader } from './account-header';

describe('AccountHeader', () => {
  let component: AccountHeader;
  let fixture: ComponentFixture<AccountHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
