import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCards } from './account-cards';

describe('AccountCards', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCards],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
