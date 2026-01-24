import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyValueDisplay } from './key-value-display';
import { KeyValueDisplayItem } from '../models/key-value-display.models';

describe('KeyValueDisplay', () => {
  let component: KeyValueDisplay;
  let fixture: ComponentFixture<KeyValueDisplay>;

  const items: KeyValueDisplayItem[] = [
    { id: '1', label: 'Full Name:', value: 'John Doe' },
    {
      id: '2',
      label: 'Role:',
      value: 'Administrator',
      valueType: 'badge',
      badgeTone: 'blue',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title and rows', () => {
    fixture.componentRef.setInput('title', 'User Information');
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.key-value-display__title');
    const rows = fixture.nativeElement.querySelectorAll('.key-value-display__row');

    expect(title.textContent).toContain('User Information');
    expect(rows.length).toBe(2);
  });

  it('should render badge values when configured', () => {
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.key-value-display__badge');
    expect(badge.textContent).toContain('Administrator');
  });
});
