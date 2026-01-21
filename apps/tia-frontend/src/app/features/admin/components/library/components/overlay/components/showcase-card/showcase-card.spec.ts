import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShowcaseCard } from './showcase-card';

describe('ShowcaseCard', () => {
  let component: ShowcaseCard;
  let fixture: ComponentFixture<ShowcaseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title when provided', () => {
    const testTitle = 'Dialogs';
    fixture.componentRef.setInput('title', testTitle);
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.showcase-card__title'),
    );
    expect(titleElement.nativeElement.textContent).toContain(testTitle);
  });

  it('should not render the title element if no title is provided', () => {
    fixture.componentRef.setInput('title', undefined);
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.showcase-card__title'),
    );
    expect(titleElement).toBeNull();
  });
});
