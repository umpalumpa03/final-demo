import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayModalComponent } from './birthday-modal';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { BirthdayLogicService } from '../services/birthday-logic.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import confetti from 'canvas-confetti';
import { signal } from '@angular/core';

vi.mock('canvas-confetti', () => {
  const mockConfetti = vi.fn(() => Promise.resolve());
  return {
    default: Object.assign(mockConfetti, { reset: vi.fn() })
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
    TestBed.resetTestingModule();

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

  it('should launch confetti when shouldLaunchConfetti signal is true', () => {
    const confettiSpy = vi.mocked(confetti);
    
    mockBirthdayService.shouldLaunchConfetti.set(true);
    component.ngOnInit();
    
    expect(confettiSpy).toHaveBeenCalled();
  });

  it('should cleanup animations and reset confetti on destroy', () => {
    const resetSpy = vi.mocked(confetti.reset);
    
    fixture.destroy();
    
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should correctly derive userName from store', () => {
    expect(component.userName()).toBe('John Doe');
  });

  it('should emit dismiss output when onDismiss is called', () => {
    const spy = vi.spyOn(component.dismiss, 'emit');
    component.onDismiss();
    expect(spy).toHaveBeenCalled();
  });
});