import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayModalComponent } from './birthday-modal';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { BirthdayLogicService } from '../services/birthday-logic.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import confetti from 'canvas-confetti';
import { signal } from '@angular/core';

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
  let birthdayLogicService: BirthdayLogicService;

  const mockBirthdayService = {
    shouldLaunchConfetti: signal(false),
    isModalVisible: signal(false),
    dismiss: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BirthdayModalComponent],
      providers: [
        provideMockStore({
          selectors: [
            { 
              selector: selectUserInfo, 
              value: {
                fullName: 'John Doe',
                birthdayModalClosedYear: 2025,
                birthday: '13-2'
              }
            }
          ]
        }),
        {
          provide: BirthdayLogicService,
          useValue: mockBirthdayService
        }
      ]
    }).compileComponents();

    birthdayLogicService = TestBed.inject(BirthdayLogicService);
    fixture = TestBed.createComponent(BirthdayModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly derive userName from store', () => {
    expect(component.userName()).toBe('John Doe');
  });

  it('should launch confetti when shouldLaunchConfetti signal is true', () => {
    const confettiSpy = vi.mocked(confetti);
    (birthdayLogicService.shouldLaunchConfetti as any).set(true);
    
    fixture.detectChanges();
    
    expect(confettiSpy).toHaveBeenCalled();
  });



  it('should emit dismiss output when onDismiss is called', () => {
    const spy = vi.spyOn(component.dismiss, 'emit');
    
    component.onDismiss();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should cleanup animations and reset confetti on destroy', () => {
    vi.mocked(confetti).mockClear();
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

  it('should have buttonIcon defined from emoji config', () => {
    expect(component.buttonIcon).toBeDefined();
  });

  it('should have headerIcon defined from emoji config', () => {
    expect(component.headerIcon).toBeDefined();
  });
});