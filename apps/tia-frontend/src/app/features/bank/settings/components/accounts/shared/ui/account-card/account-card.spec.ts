import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCard } from './account-card';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { AccountType } from '@tia/shared/models/accounts/accounts.model';

describe('AccountCard', () => {
  let component: AccountCard;
  let fixture: ComponentFixture<AccountCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCard, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCard);
    component = fixture.componentInstance;
    // provide required inputs before change detection runs as Angular signals
    component.isFavorite = signal(false) as unknown as typeof component.isFavorite;
    component.isHidden = signal(false) as unknown as typeof component.isHidden;
    component.name = signal('Test account') as unknown as typeof component.name;
    component.type = signal(('CURRENT' as unknown as AccountType)) as unknown as typeof component.type;
    component.currency = signal('USD') as unknown as typeof component.currency;
    component.balance = signal('0.00') as unknown as typeof component.balance;
    component.iban = signal('IBAN123') as unknown as typeof component.iban;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
