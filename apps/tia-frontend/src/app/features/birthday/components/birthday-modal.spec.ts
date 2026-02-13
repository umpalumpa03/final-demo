import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayModalComponent } from './birthday-modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import confetti from 'canvas-confetti';

// Mock confetti
vi.mock('canvas-confetti', () => {
  const mockConfetti = vi.fn();
  mockConfetti.reset = vi.fn();
  return {
    default: mockConfetti,
  };
});

describe('BirthdayModalComponent', () => {
  let component: BirthdayModalComponent;
  let fixture: ComponentFixture<BirthdayModalComponent>;
  let store: MockStore;

  const mockUser = {
    fullName: 'John Doe',
    birthdayModalClosedYear: 2023
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BirthdayModalComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectUserInfo, value: mockUser }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BirthdayModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly derive userName from store', () => {
    expect(component.userName()).toBe('John Doe');
  });

  it('should launch confetti if user has not closed modal this year', () => {
    const confettiSpy = vi.mocked(confetti);
    
    fixture.detectChanges(); 
    
    expect(confettiSpy).toHaveBeenCalled();
  });

  it('should NOT launch confetti if modal was already closed this year', () => {
    const currentYear = new Date().getFullYear();
    store.overrideSelector(selectUserInfo, { 
      ...mockUser, 
      birthdayModalClosedYear: currentYear 
    });
    store.refreshState();
    
    const confettiSpy = vi.mocked(confetti);
    fixture.detectChanges();

    expect(confettiSpy).not.toHaveBeenCalled();
  });

  it('should emit dismiss output when onDismiss is called', () => {
    const spy = vi.spyOn(component.dismiss, 'emit');
    
    component.onDismiss();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should cleanup animations and reset confetti on destroy', () => {
    fixture.detectChanges();
    
    const resetSpy = vi.mocked(confetti).reset;
    
    fixture.destroy();
    
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should correctly filter middle emojis from config', () => {
    const hasHeader = component.middleEmojis.some(e => e.name === 'header');
    const hasButtonIcon = component.middleEmojis.some(e => e.name === 'buttonHearth');
    
    expect(hasHeader).toBe(false);
    expect(hasButtonIcon).toBe(false);
    expect(component.middleEmojis.length).toBeGreaterThan(0);
  });
});