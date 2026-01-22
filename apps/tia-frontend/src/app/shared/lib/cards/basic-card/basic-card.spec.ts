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

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    
    const title = fixture.nativeElement.querySelector('.card__title');
    expect(title.textContent).toBe('Test Title');
  });

  it('should render subtitle when provided', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    fixture.detectChanges();
    
    const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should not render subtitle when not provided', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();
    
    const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
    expect(subtitle).toBeFalsy();
  });

  it('should render content when provided', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('content', 'Test Content');
    fixture.detectChanges();
    
    const content = fixture.nativeElement.querySelector('.card__content p');
    expect(content.textContent).toBe('Test Content');
  });

  it('should not render content when not provided', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();
    
    const content = fixture.nativeElement.querySelector('.card__content');
    expect(content).toBeFalsy();
  });

  it('should apply custom width', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('width', '40rem');
    fixture.detectChanges();
    
    const card = fixture.nativeElement.querySelector('.card');
    expect(card.style.width).toBe('40rem');
  });

  it('should apply custom height', () => {
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('height', '30rem');
    fixture.detectChanges();
    
    const card = fixture.nativeElement.querySelector('.card');
    expect(card.style.height).toBe('30rem');
  });
});