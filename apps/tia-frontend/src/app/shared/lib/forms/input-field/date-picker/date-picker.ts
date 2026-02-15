import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
  ElementRef,
  inject,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CalendarDay, DatePickerView } from '../../models/input.model';
import { MONTHS, WEEK_DAYS } from '../../config/text-input.config';

@Component({
  selector: 'lib-date-picker',
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePicker {
  private elementRef = inject(ElementRef);

  selectedDate = input<string | number | null>(null);
  minDate = input<string | number | undefined>(undefined);
  maxDate = input<string | number | undefined>(undefined);
  isOpen = input<boolean>(false);

  @ViewChildren('yearBtn') yearButtons!: QueryList<ElementRef>;

  dateSelected = output<string>();
  closed = output<void>();

  protected readonly weekDays = WEEK_DAYS;
  protected readonly months = MONTHS;

  protected readonly currentMonth = signal<Date>(new Date());
  protected readonly currentView = signal<DatePickerView>('calendar');
  protected readonly today = new Date();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;

    const target = event.target as HTMLElement;

    if (!document.body.contains(target)) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.close();
    }
  }

  constructor() {
    effect(() => {
      const selected = this.selectedDate();
      if (selected && this.isOpen()) {
        const dateStr =
          typeof selected === 'number' ? String(selected) : selected;
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          this.currentMonth.set(
            new Date(date.getFullYear(), date.getMonth(), 1),
          );
        }
      }
      if (this.isOpen()) {
        this.currentView.set('calendar');
      }
    });
  }

  protected switchToMonths(): void {
    this.currentView.set('months');
  }

  protected selectMonth(monthIndex: number): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), monthIndex, 1));
    this.currentView.set('calendar');
  }

  protected selectYear(year: number): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(year, current.getMonth(), 1));
    this.currentView.set('calendar');
  }

  protected readonly calendarDays = computed<CalendarDay[]>(() => {
    const current = this.currentMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: CalendarDay[] = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(date, false));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(this.createCalendarDay(date, true));
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(this.createCalendarDay(date, false));
    }

    return days;
  });

  protected switchToYears(): void {
    this.currentView.set('years');

    setTimeout(() => {
      const activeYear = this.currentMonth().getFullYear();
      const btn = Array.from(
        document.querySelectorAll('.date-picker__selection-item'),
      ).find((el) => el.textContent?.trim() === String(activeYear));

      if (btn) {
        btn.scrollIntoView({ block: 'center' });
      }
    }, 0);
  }

  private createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const dateStr = this.formatDate(date);
    const selected = this.selectedDate();
    const selectedStr = selected
      ? typeof selected === 'number'
        ? String(selected)
        : selected
      : null;
    const min = this.minDate();
    const minStr =
      min !== undefined ? (typeof min === 'number' ? String(min) : min) : null;
    const max = this.maxDate();
    const maxStr =
      max !== undefined ? (typeof max === 'number' ? String(max) : max) : null;

    const isToday = this.isSameDay(date, this.today);
    const isSelected = selectedStr ? dateStr === selectedStr : false;

    let isDisabled = false;
    if (minStr && dateStr < minStr) isDisabled = true;
    if (maxStr && dateStr > maxStr) isDisabled = true;

    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled,
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(
      new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  protected readonly yearList = computed<number[]>(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear + 50;

    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  });

  protected isYearDisabled(year: number): boolean {
    const min = this.minDate();
    const max = this.maxDate();

    if (min) {
      const minYear = new Date(min).getFullYear();
      if (year < minYear) return true;
    }

    if (max) {
      const maxYear = new Date(max).getFullYear();
      if (year > maxYear) return true;
    }

    return false;
  }

  protected nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(
      new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  }

  protected selectDate(day: CalendarDay): void {
    if (day.isDisabled) return;
    const dateStr = this.formatDate(day.date);
    this.dateSelected.emit(dateStr);
  }

  protected close(): void {
    this.closed.emit();
  }

  protected selectToday(): void {
    const todayStr = this.formatDate(this.today);
    this.dateSelected.emit(todayStr);
    this.currentMonth.set(new Date());
    this.currentView.set('calendar');
  }
}
