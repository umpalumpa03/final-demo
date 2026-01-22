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

  it('should create', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    
    const title = fixture.nativeElement.querySelector('.card__title');
    expect(title.textContent).toBe('Test Title');
  });

  it('should render subtitle when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('subtitle', 'Test Subtitle');
    fixture.detectChanges();
    
    const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toBe('Test Subtitle');
  });

  it('should not render subtitle when not provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    
    const subtitle = fixture.nativeElement.querySelector('.card__subtitle');
    expect(subtitle).toBeFalsy();
  });

  it('should render content when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('content', 'Test Content');
    fixture.detectChanges();
    
    const content = fixture.nativeElement.querySelector('.card__content p');
    expect(content).toBeTruthy();
    expect(content.textContent).toBe('Test Content');
  });

  it('should not render content when not provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    
    const content = fixture.nativeElement.querySelector('.card__content');
    expect(content).toBeFalsy();
  });
});