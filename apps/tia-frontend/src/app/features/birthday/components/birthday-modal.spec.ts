import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayModalComponent } from './birthday-modal';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { BirthdayLogicService } from '../services/birthday-logic.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('BirthdayModalComponent', () => {
  let component: BirthdayModalComponent;
  let fixture: ComponentFixture<BirthdayModalComponent>;

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

    fixture = TestBed.createComponent(BirthdayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly derive userName from store', () => {
    expect(component.userName()).toBe('John Doe');
  });

  it('should emit dismiss output when onDismiss is called', () => {
    const spy = vi.spyOn(component.dismiss, 'emit');
    component.onDismiss();
    expect(spy).toHaveBeenCalled();
  });

  it('should correctly filter middle emojis from config', () => {
    const hasHeader = component.middleEmojis.some(e => e.name === 'header');
    const hasButtonIcon = component.middleEmojis.some(e => e.name === 'buttonHearth');
    
    expect(hasHeader).toBe(false);
    expect(hasButtonIcon).toBe(false);
    expect(component.middleEmojis.length).toBeGreaterThan(0);
  });
});