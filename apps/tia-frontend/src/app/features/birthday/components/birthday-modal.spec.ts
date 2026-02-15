import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { BirthdayModalComponent } from './birthday-modal';
import { TranslateModule } from '@ngx-translate/core';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  beforeAll,
} from 'vitest';

vi.mock('canvas-confetti', () => {
  const fn = vi.fn();
  (fn as any).reset = vi.fn();
  return { default: fn };
});

import confetti from 'canvas-confetti';

describe('BirthdayModalComponent', () => {
  let component: BirthdayModalComponent;
  let fixture: ComponentFixture<BirthdayModalComponent>;

  const START_DATE = new Date('2026-01-01T00:00:00Z');

  beforeAll(() => {
    if (!globalThis.requestAnimationFrame) {
      globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
      globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
    }
    if (!HTMLCanvasElement.prototype.getContext) {
      HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(),
        createImageData: vi.fn(),
        setTransform: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),
        transform: vi.fn(),
        rect: vi.fn(),
        clip: vi.fn(),
      })) as any;
    }
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    vi.useFakeTimers();
    vi.setSystemTime(START_DATE);

    await TestBed.configureTestingModule({
      imports: [
        BirthdayModalComponent, 
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUserInfo,
              value: {
                fullName: 'John Doe',
                birthdayModalClosedYear: 2025,
                birthday: '13-02',
              },
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BirthdayModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should stop confetti after duration', () => {
    const duration = 3000;

    vi.setSystemTime(new Date(START_DATE.getTime() + duration + 100));
    vi.advanceTimersByTime(duration + 100);

    const countAfterEnd = (confetti as any).mock.calls.length;

    vi.setSystemTime(new Date(START_DATE.getTime() + duration + 2000));
    vi.advanceTimersByTime(2000);

    expect((confetti as any).mock.calls.length).toBe(countAfterEnd);
  });

  it('should emit dismiss output', () => {
    const spy = vi.spyOn(component.dismiss, 'emit');
    component.onDismiss();
    expect(spy).toHaveBeenCalled();
  });

  it('should derive userName from store', () => {
    expect(component.userName()).toBe('John Doe');
  });

  it('should filter middle emojis correctly', () => {
    const hasInvalid = component.middleEmojis.some(
      (e) => e.name === 'header' || e.name === 'buttonHearth',
    );
    expect(hasInvalid).toBe(false);
  });


  it('should display translation keys in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.birthday-content__message')).toBeTruthy();
    expect(compiled.querySelector('.birthday-content__note')).toBeTruthy();
  });

  it('should verify userName is correctly derived for the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.birthday-content__title');
    
    expect(titleElement).toBeTruthy();
    expect(component.userName()).toBe('John Doe');
  });

  it('should render the dismiss button with translation key', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('app-button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toBeDefined();
  });
});