import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePicker } from './date-picker';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('DatePicker', () => {
  let component: DatePicker;
  let fixture: ComponentFixture<DatePicker>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [DatePicker],
    }).compileComponents();
    fixture = TestBed.createComponent(DatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.useRealTimers());

  it('should handle view switching and auto-scrolling', () => {
    expect(component['currentView']()).toBe('calendar');

    component['switchToMonths']();
    expect(component['currentView']()).toBe('months');

    const scrollSpy = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollSpy;
    component['currentMonth'].set(new Date(2025, 0, 1));

    component['switchToYears']();
    expect(component['currentView']()).toBe('years');
    vi.runAllTimers();

    component['selectYear'](2030);
    expect(component['currentMonth']().getFullYear()).toBe(2030);
    expect(component['currentView']()).toBe('calendar');

    component['switchToMonths']();
    component['selectMonth'](5);
    expect(component['currentMonth']().getMonth()).toBe(5);
    expect(component['currentView']()).toBe('calendar');
  });

  it('should navigate months and handle year boundaries', () => {
    component['currentMonth'].set(new Date(2025, 0, 1));

    component['previousMonth']();
    expect(component['currentMonth']().getFullYear()).toBe(2024);
    expect(component['currentMonth']().getMonth()).toBe(11);

    component['nextMonth']();
    expect(component['currentMonth']().getFullYear()).toBe(2025);
    expect(component['currentMonth']().getMonth()).toBe(0);
  });

  it('should generate calendar grid and handle min/max constraints', () => {
    fixture.componentRef.setInput('minDate', '2025-05-10');
    fixture.componentRef.setInput('maxDate', '2025-05-20');
    component['currentMonth'].set(new Date(2025, 4, 1));
    fixture.detectChanges();

    const days = component['calendarDays']();
    expect(days.length).toBe(42);

    const earlyDay = days.find((d) => d.day === 5 && d.isCurrentMonth);
    expect(earlyDay?.isDisabled).toBe(true);

    const validDay = days.find((d) => d.day === 15 && d.isCurrentMonth);
    expect(validDay?.isDisabled).toBe(false);

    const lateDay = days.find((d) => d.day === 25 && d.isCurrentMonth);
    expect(lateDay?.isDisabled).toBe(true);

    expect(component['isYearDisabled'](2024)).toBe(true);
    expect(component['isYearDisabled'](2025)).toBe(false);
  });

  it('should handle selection and outside clicks', () => {
    const emitSpy = vi.spyOn(component.dateSelected, 'emit');
    const closeSpy = vi.spyOn(component.closed, 'emit');

    component['selectToday']();
    expect(emitSpy).toHaveBeenCalled();

    const validDay = {
      date: new Date(2025, 5, 15),
      day: 15,
      isCurrentMonth: true,
      isToday: false,
      isSelected: false,
      isDisabled: false,
    };
    component['selectDate'](validDay);
    expect(emitSpy).toHaveBeenCalledWith('2025-06-15');

    emitSpy.mockClear();
    component['selectDate']({ ...validDay, isDisabled: true });
    expect(emitSpy).not.toHaveBeenCalled();

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    component['onDocumentClick']({ target: document.body } as any);
    expect(closeSpy).toHaveBeenCalled();
  });
});
