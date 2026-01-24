import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicCard } from './basic-card';

describe('BasicCard', () => {
  let component: BasicCard;
  let fixture: ComponentFixture<BasicCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicCard);
    component = fixture.componentInstance;
  });

  it('should render title and optional subtitle', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.card__title');
    const subtitle = fixture.nativeElement.querySelector('.card__subtitle');

    expect(title.textContent).toBe('Test Title');
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should render content when provided', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('content', 'Test Content');
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.card__content p');
    expect(content.textContent).toBe('Test Content');
  });

  it('should apply custom dimensions', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('width', '40rem');
    fixture.componentRef.setInput('height', '30rem');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');
    expect(card.style.width).toBe('40rem');
    expect(card.style.height).toBe('30rem');
  });

  it('should render footer when hasFooter is true', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('hasFooter', true);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('.card__footer');
    expect(footer).toBeTruthy();
  });
});