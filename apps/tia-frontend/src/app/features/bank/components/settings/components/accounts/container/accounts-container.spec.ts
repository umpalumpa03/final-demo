import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsContainer } from './accounts-container';

describe('AccountsContainer', () => {
  let component: AccountsContainer;
  let fixture: ComponentFixture<AccountsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
