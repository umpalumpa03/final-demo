import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDisplay } from './list-display';
import { ListDisplayItem } from '../models/list-display.models';

describe('ListDisplay', () => {
  let component: ListDisplay;
  let fixture: ComponentFixture<ListDisplay>;

  const items: ListDisplayItem[] = [
    {
      id: 'item-1',
      initials: 'JD',
      name: 'John Doe',
      role: 'Admin',
      statusTone: 'green',
      badge: { label: 'Admin', tone: 'blue' },
    },
    {
      id: 'item-2',
      initials: 'JS',
      name: 'Jane Smith',
      role: 'Editor',
      statusTone: 'orange',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render list items and badges', () => {
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.list-display__card');
    const badges = fixture.nativeElement.querySelectorAll('.list-display__badge');

    expect(cards.length).toBe(2);
    expect(badges.length).toBe(1);
    expect(badges[0].textContent).toContain('Admin');
  });

  it('should emit selection when selectable', () => {
    const spy = vi.fn();
    component.selected.subscribe(spy);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const firstCard: HTMLElement =
      fixture.nativeElement.querySelector('.list-display__card');
    firstCard.click();

    expect(spy).toHaveBeenCalledWith(items[0]);
  });

  it('should not emit selection when not selectable', () => {
    const spy = vi.fn();
    component.selected.subscribe(spy);

    component.onSelect(items[0]);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should build badge class with and without tone', () => {
    expect(component.badgeClass()).toBe('list-display__badge');
    expect(component.badgeClass('green')).toBe(
      'list-display__badge list-display__badge--green',
    );
  });

  it('should build status class with and without tone', () => {
    expect(component.statusClass()).toBe('list-display__status');
    expect(component.statusClass('orange')).toBe(
      'list-display__status list-display__status--orange',
    );
  });
});
