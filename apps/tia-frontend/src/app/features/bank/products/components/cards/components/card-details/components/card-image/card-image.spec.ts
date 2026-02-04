import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardImage } from './card-image';

describe('CardImage', () => {
  let component: CardImage;
  let fixture: ComponentFixture<CardImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImage],
    }).compileComponents();

    fixture = TestBed.createComponent(CardImage);
    component = fixture.componentInstance;
  });

  it('should create and render with inputs', () => {
    fixture.componentRef.setInput('imageBase64', 'base64string');
    fixture.componentRef.setInput('cardName', 'Test Card');
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});