import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineDisplay } from './timeline-display';
import { TimelineDisplayItem } from '../models/timeline-display.models';

describe('TimelineDisplay', () => {
  let component: TimelineDisplay;
  let fixture: ComponentFixture<TimelineDisplay>;

  const items: TimelineDisplayItem[] = [
    {
      id: '1',
      title: 'Deployed to production',
      timestamp: '2 hours ago',
      tone: 'green',
    },
    {
      id: '2',
      title: 'Pull request opened',
      timestamp: '1 day ago',
      tone: 'orange',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineDisplay);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render timeline items', () => {
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const entries = fixture.nativeElement.querySelectorAll(
      '.timeline-display__item',
    );
    expect(entries.length).toBe(2);
  });

  it('should hide line for the last item', () => {
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll(
      '.timeline-display__line',
    );
    const lastLine = lines[1];
    expect(lastLine.classList.contains('timeline-display__line--hidden')).toBe(
      true,
    );
  });

  it('should build dot class with and without tone', () => {
    expect(component.dotClass()).toBe('timeline-display__dot');
    expect(component.dotClass('green')).toBe(
      'timeline-display__dot timeline-display__dot--green',
    );
  });
});
