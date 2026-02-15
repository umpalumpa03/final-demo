import { TestBed } from '@angular/core/testing';
import { AccountCard } from './account-card';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { AccountType } from '@tia/shared/models/accounts/accounts.model';

describe('AccountCard', () => {
  let component: AccountCard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountCard,
        { provide: BreakpointService, useValue: { isXsMobile: false } },
      ],
    });

    component = TestBed.inject(AccountCard);
  });

  it('computes badge as Hidden when isHidden is true', () => {
    // `input` bindings are functions on the component instance in tests — assign callables
    component.isHidden = (() => true) as any;
    component.isFavorite = (() => false) as any;
    expect(component.badge()).toBe('Hidden');
  });

  it('computes badge as Favorite when isFavorite is true and not hidden', () => {
    component.isHidden = (() => false) as any;
    component.isFavorite = (() => true) as any;
    expect(component.badge()).toBe('Favorite');
  });

  it('emits favorite/hide/friendlyName events on actions', () => {
    component.isFavorite = (() => true) as any;
    component.isHidden = (() => false) as any;

    const favSpy = vi.spyOn((component as any).clickFaforite, 'emit');
    const hideSpy = vi.spyOn((component as any).clickHideUnhide, 'emit');
    const nameSpy = vi.spyOn((component as any).clickFriendlyName, 'emit');

    component.onFavoriteClick();
    expect(favSpy).toHaveBeenCalledWith(true);

    component.onHideUnhideClick();
    expect(hideSpy).toHaveBeenCalledWith(false);

    component.onFriendlyNameClick();
    expect(nameSpy).toHaveBeenCalledWith(true);
  });
});

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
    component.isFavorite = signal(
      false,
    ) as unknown as typeof component.isFavorite;
    component.isHidden = signal(false) as unknown as typeof component.isHidden;
    component.name = signal('Test account') as unknown as typeof component.name;
    component.type = signal(
      'CURRENT' as unknown as AccountType,
    ) as unknown as typeof component.type;
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
