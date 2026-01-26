import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BankHeaderContainer } from './bank-header-container';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hasUnread as true by default', () => {
    expect(component.hasUnread()).toBe(true);
  });

  it('should log when onNotificationClick is called', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.onNotificationClick();
    expect(consoleSpy).toHaveBeenCalledWith('loading mod');
  });
});
