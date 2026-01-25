import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollArea } from './scroll-area';
import { By } from '@angular/platform-browser';

describe('ScrollArea', () => {
  let component: ScrollArea;
  let fixture: ComponentFixture<ScrollArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollArea],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply vertical class by default', () => {
    const element = fixture.debugElement.query(By.css('.ta-scroll-area'));
    expect(element.nativeElement.classList).toContain('vertical');
  })

  it('should apply horizontal class when direction is set', () => {
    fixture.componentRef.setInput('direction', 'horizontal');
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.ta-scroll-area'));
    expect(element.nativeElement.classList).toContain('horizontal');
  });

  it('should set height style when height input is provided', () => {
    fixture.componentRef.setInput('height', '300px');
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.ta-scroll-area'));
    expect(element.nativeElement.style.height).toBe('300px');
  });
});
